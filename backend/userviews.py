from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
import base64

# MongoDB setup

client = MongoClient("mongodb://localhost:27017/")
db = client["AskU"]  # Replace with your database name
collection1 = db["users"]       # Replace with your collection name
counter_collection = db["counters"]  # For tracking the last inserted integer ID

# Create a counter document if it doesn't exist
if not counter_collection.find_one({"_id": "user_counter"}):
    counter_collection.insert_one({"_id": "user_counter", "seq": 0})
# Function to get the next integer ID
def get_next_user_id():
    counter = counter_collection.find_one_and_update(
        {"_id": "user_counter"},
        {"$inc": {"seq": 1}},
        return_document=True
    )
    return counter["seq"]

@api_view(['POST'])
def regiserUser(request):
   if request.method == 'POST':
        # Insert a new document with a custom integer ID
        new_user = request.data
        new_user["_id"] = get_next_user_id()  # Set the custom integer ID
        collection1.insert_one(new_user)
        return Response(new_user, status=status.HTTP_201_CREATED)

@api_view(['PUT','GET', 'DELETE'])
def editUserByEmailPass(request,email,password):
    try:
        # Find the user by custom integer `id`
        user = collection1.find_one({"email": email, "pass": password}, {"_id": 0})
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        user = dict(user)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == 'GET':
        return Response(user)
    
    elif request.method == 'PUT':
        try:
            updated_data = {}
            if 'email' in request.data:
                updated_data['email'] = request.data['email']

            if 'mobile' in request.data:
                updated_data['mobile'] = request.data['mobile']
                
            if 'pass' in request.data:
                updated_data['pass'] = request.data['pass']
            # Check if an image is provided
            if 'image' in request.FILES:
                image_file = request.FILES['image'].read()
                encoded_image = base64.b64encode(image_file).decode('utf-8')
                updated_data['image'] = encoded_image

            # Update the user profile
            collection1.update_one(
                {"email": email, "pass": password},
                {"$set": updated_data}
            )
            return Response({"message": "Profile updated successfully!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    elif request.method == 'DELETE':
        # Delete the drink by custom integer `id`
        collection1.delete_one({"_id": id})
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PUT','GET', 'DELETE'])
def editUser(request,id):
    try:
        # Find the user by custom integer `id`
        user = collection1.find_one({"_id": id}, {"_id": 0})
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == 'GET':
        return Response(user)
    
    elif request.method == 'PUT':
        # Update the drink with new data
        updated_data = request.data
        if 'image' in request.FILES:
                image = request.FILES['image']

                # Convert the image to Base64 format
                image_data = base64.b64encode(image.read()).decode('utf-8')
                updated_data['image'] = image_data
        collection1.update_one({"_id": id}, {"$set": updated_data})
        return Response(updated_data)
    
    elif request.method == 'DELETE':
        # Delete the drink by custom integer `id`
        collection1.delete_one({"_id": id})
        return Response(status=status.HTTP_204_NO_CONTENT)
  