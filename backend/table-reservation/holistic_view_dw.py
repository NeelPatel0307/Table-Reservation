"""
The restaurants must be able to view, how many tables are booked and at what time
intervals in daily, weekly, and monthly views
"""

import functions_framework
import firebase_admin
from firebase_admin import credentials, firestore
import pendulum
from firebase_functions import https_fn, options
from google.cloud.firestore_v1.base_query import FieldFilter


cred = credentials.Certificate('serviceAccount.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["post"],
    )
)   
@functions_framework.http
def get_reservations_dw(request):

    try:
        request_json = request.get_json()
        rid = request_json.get('restaurant_id')
        date = request_json.get('date')

        if not rid:
            return {
                "ok": "false",
                "message": "RestaurantId is required",
                "status_code": 400
            }

        if not date:
            return {
                "ok": "false",
                "message": "Date is required",
                "status_code": 400
            }

        users_ref = db.collection("Reservation")
        restaurant_dets = users_ref.where(filter=FieldFilter("restaurant_id", "==", rid))
        cur_date = pendulum.from_format(date, "YYYY-MM-DD", tz = "America/Halifax")

        docs_daily = restaurant_dets.where(filter=FieldFilter("date", "==", date))
        print("Daily complete")
        # I am assuming that the week starts on Monday
        start_date = cur_date.start_of('week').format("YYYY-MM-DD")
        end_date = cur_date.end_of('week').format("YYYY-MM-DD")
        docs_weekly = restaurant_dets.where(filter=FieldFilter("date", ">=", start_date)).where(filter=FieldFilter("date", "<=", end_date))
        daily, weekly = [], []

        for doc in docs_daily.stream():
            document_dict = doc.to_dict()
            daily.append(document_dict)
        
        for doc in docs_weekly.stream():
            document_dict = doc.to_dict()
            weekly.append(document_dict)
        
        print("Appended")
        daily_slots = calculate_tables_booked_given_slots(daily)
        weekly_slots = calculate_tables_booked_given_slots(weekly)
        #print(json_data)
        return {
            "ok": "true",
            "data": {
                "daily": daily_slots,
                "weekly": weekly_slots
            },
            "status_code": 200 
        }

    except Exception as e:
        return {
            "ok": "false",
            "message": f"Could not retrieve data!: {e}",
            "status_code": 500
        }



def calculate_tables_booked_given_slots(docs):

    slots = {}
    table_ids_per_slot = {}

    for doc in docs:
        time_slot = doc['time']
        table_ids = doc['table_ids']
        if time_slot not in slots:
            slots[time_slot] = 0
            table_ids_per_slot[time_slot] = []
        slots[time_slot] += len(table_ids)
        table_ids_per_slot[time_slot].extend(table_ids)

    response = {
        "num_tables_booked_per_slot": slots,
        "booked_tables_per_slot": table_ids_per_slot
    }

    return response
    