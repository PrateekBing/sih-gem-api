from flask import Flask, jsonify
import google.generativeai as gemini

app = Flask(__name__)

# Configure the Gemini API key
gemini.configure(api_key="AIzaSyBShrIVy_UqwUpWZeIiMirTY5sGSs9HbgI")

# Initialize the model
model = gemini.GenerativeModel("gemini-1.5-flash")

# Define the route to process the input
@app.route('/chat/<string:a>', methods=['GET'])
def response_func(a):

    response = model.generate_content(
        "Your knowledge is constrained to museums, tourist places, and other places of heritage in India. " + "Anything outside of that scope is strictly irrelevant and should trigger the exception handle. " + "Categorize the following user input into one of the predefined categories: 1. Booking Ticket, " + "2. Tour Packages, 3. Ticket Cost, 4. Ticket Cancellation. Only choose the most relevant category " + "if the user's input clearly aligns with one of these options. If the input does not reasonably fit " + "any category, reply with: \"Sorry, I can't help with that request.\" Only respond with 1, 2, 3, or 4 as appropriate. " + "No other responses are permitted. Beware of conjoined questions where one question is relevant and the other one isn't, " + "in this case, do not return any numbers but only return the exception handle. User's Input: " + a)
    
    buffer = []
    for chunk in response:
        for part in chunk.parts:
            buffer.append(part.text)
    bruh = ''.join(buffer)

    if "1" in bruh:
        x = "bookTicket()"
    elif "2" in bruh:
        x = "tourPackages()"
    elif "3" in bruh:
        x = "ticketPrice()"
    elif "4" in bruh:
        x = "ticketCancellation()"
    else:
        x = "Sorry, can't help with that request"
    
    return jsonify({"Response": x})

if __name__ == '__main__':
    app.run()
