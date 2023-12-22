"""
The restaurants must be able to view, how many tables are booked and at what time
intervals in daily, weekly, and monthly views
"""

import functions_framework
import firebase_admin
from firebase_admin import credentials, firestore
import requests
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
def get_reservations_monthly(request):

    try:
        request_json = request.get_json()
        rid = request_json.get('restaurant_id')
        month = request_json.get('month')
        year = request_json.get('year')

        if not rid:
            return {
                "ok": "false",
                "message": "RestaurantId is required",
                "status_code": 400
            }

        if not month:
            return {
                "ok": "false",
                "message": "Month is required",
                "status_code": 400
            }

        users_ref = db.collection("Reservation")
        restaurant_dets = users_ref.where(filter=FieldFilter("restaurant_id", "==", rid))
        cur_month = pendulum.from_format(f"{month}-{year}", "MM-YYYY", tz = "America/Halifax")

        # I am assuming that the week starts on Monday
        start_date = cur_month.start_of('month').format("YYYY-MM-DD")
        end_date = cur_month.end_of('month').format("YYYY-MM-DD")
        docs_monthly = restaurant_dets.where(filter=FieldFilter("date", ">=", start_date)).where(filter=FieldFilter("date", "<=", end_date))
        monthly = []

        for doc in docs_monthly.stream():
            data = doc.to_dict()
            monthly.append(data)

        response = calculate_tables_booked_given_slots(monthly)
        return {
            "ok": "true",
            "data": {
                "monthly": response
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