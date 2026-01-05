import pandas as pd
import numpy as np
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def main(dataset_path):
    dataset = dataset_path
    df = pd.read_csv(dataset)
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    threat_events = ['failed_login', 'phishing_click']
    df['is_threat'] = df['event_type'].apply(lambda x: 1 if x in threat_events else 0)

    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['last_active_str'] = df['timestamp'].astype(str)

    features = df.drop(['is_threat', 'event_type', 'timestamp', 'device_id', 'ip_address', 'last_active_str'], axis=1)
    target = df['is_threat']

    X_train, X_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42, stratify=target
    )

    cat_cols = ['user_id', 'location', 'resource_type', 'resource_name', 'auth_result']
    num_cols = ['event_value', 'hour', 'day_of_week']

    preprocessor = ColumnTransformer([
        ('num', StandardScaler(), num_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)
    ])

    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    total_threats = int(df['is_threat'].sum())

    daily_threats = df[df['is_threat'] == 1].set_index('timestamp').resample('D').size()
    daily_threats_dict = {str(k.date()): int(v) for k, v in daily_threats.items() if v > 0}

    top_threats = df[df['is_threat'] == 1]['event_type'].value_counts().head(10)
    top_threats_dict = top_threats.to_dict()

    risk_profile = df.groupby('event_type')['is_threat'].mean().mul(100).round(2)
    risk_dict = {k: f"{v}%" for k, v in risk_profile.items()}


    threat_reasons = df[df['is_threat'] == 1].groupby('user_id')['event_type'].unique()

    user_agg = df.groupby('user_id').agg(
        total_events=('event_type', 'count'),
        threat_events=('is_threat', 'sum'),
        last_active=('last_active_str', 'max'),
        unique_locations=('location', lambda x: list(x.unique()))
    ).reset_index()

    def generate_alert_reason(row):
        count = row['threat_events']
        if count == 0:
            return "Normal activity: No threats detected."
        
        causes = threat_reasons.get(row['user_id'], [])
        cause_str = ", ".join(causes)
        
        return f"High Risk: Detected {int(count)} [{cause_str}] threat event(s)"

    user_agg['alert_reason'] = user_agg.apply(generate_alert_reason, axis=1)


    user_activity_list = user_agg.sort_values('threat_events', ascending=False).to_dict(orient='records')

    output_json = {
        "model_performance": {
            "accuracy": f"{accuracy:.2%}",
            "status": "Goal Met" if accuracy > 0.95 else "Goal Failed"
        },
        "threat_analytics": {
            "total_threat_count": total_threats,
            "threats_per_day": daily_threats_dict,
            "top_threat_subclasses": top_threats_dict,
            "risk_percentage_by_event": risk_dict
        },
        "user_activity_monitor": user_activity_list[:5]
    }

    return output_json

if __name__ == "__main__":
    print(json.dumps(main('dataset.csv'), indent=4))