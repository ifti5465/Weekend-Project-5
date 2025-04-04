import requests
from web3 import Web3

OLLAMA_API_URL = "http://localhost:11434/api/chat"  # Ollama's chat endpoint
MODEL_NAME = "llama3"  # Change this to the model you installed (e.g., llama3)

CONTRACT_ADDRESS = '0x35A517872aD6B5A981667cF0b571E43FFC579FED'
# Smart contract ABI
ABI = [
    {
        "inputs": [],
        "name": "receive",
        "stateMutability": "payable",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "name": "PaymentReceived",
        "type": "event",
        "inputs": [
            {"indexed": True, "name": "from", "type": "address"},
            {"indexed": False, "name": "amount", "type": "uint256"},
        ],
    },
]

# Connect to the Ethereum network (use your local Ganache or Remix provider)
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))  # Adjust this if using a different local instance

# Check if connected to the Ethereum network
if not w3.isConnected():
    print("Failed to connect to the Ethereum network. Please check your provider.")
    exit()

# Initialize the smart contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

# Initial system message that sets up the bot's persona - hidden from user
initial_system_message = """You are an experienced Indian chef with a specialty in brown cuisine. You provide tips and tricks for cooking and food preparation. You are clear and provide excellent recipes tailored to users' needs. You're knowledgeable about different cuisines and cooking techniques, patient and understanding with questions.

Your specialties are:
1. Suggesting Indian dishes based on available ingredients
2. Providing detailed recipes for specific Indian dishes
3. Discussing recipe improvements and variations

**Important**: When responding to when a user picks "Finding an Indian dish based on ingredients you have", you should **only provide the names of dishes with no recipes**. Do not provide any additional comments or details just a list of dish names with the users' ingredients.
Always maintain a warm, conversational tone as if you're a real chef talking directly to the person. Never mention that you're an AI, a model, or that this is a script or program. Respond as a knowledgeable Indian chef would in natural conversation."""

messages = [
    {
        "role": "system",
        "content": initial_system_message,
    }
]

# First user message to set the conversation
messages.append(
    {
        "role": "user",
        "content": "Hello! I'm interested in Indian cuisine. Can you help me with either finding a dish based on ingredients I have, getting a recipe for a specific Indian dish, or discussing how to improve a Indian recipe I've tried?"
    }
)

# Get initial response
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    stream=True,
)

# Print the welcome message
collected_messages = []
for chunk in stream:
    chunk_message = chunk.choices[0].delta.content or ""
    print(chunk_message, end="")
    collected_messages.append(chunk_message)

# Save the assistant's response
messages.append(
    {
        "role": "assistant",
        "content": "".join(collected_messages)
    }
)

# Now ask the user which type of assistance they need
print("\n\nWhat would you like help with today?")
print("a. Finding an Indian dish based on ingredients you have")
print("b. Getting a recipe for a specific Indian dish")
print("c. Discussing improvements for an Indian recipe you've tried")

while True:
    choice = input("\nPlease enter your choice (a, b, or c): ").strip().lower()

    if choice == 'a':
        ingredients = input("\nWhat ingredients do you have on hand? ")
        messages.append(
            {
                "role": "user",
                "content": f"I have {ingredients}. What Indian dish could I make with these?"
            }
        )
        break

    elif choice == 'b':
        dish = input("\nWhich Indian dish would you like the recipe for? ")
        messages.append(
            {
                "role": "user",
                "content": f"I'd love to learn how to make {dish}. Can you share a detailed recipe and preparation steps?"
            }
        )
        break

    elif choice == 'c':
        dish = input("\nWhich Indian dish have you tried making? ")
        feedback = input("What would you like to improve about it? ")
        messages.append(
            {
                "role": "user",
                "content": f"I tried making {dish} but {feedback}. Do you have any suggestions for improvement?"
            }
        )
        break

    else:
        print("I didn't understand that. Please enter a, b, or c.")

# Get and print the response
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    stream=True,
)

collected_messages = []
for chunk in stream:
    chunk_message = chunk.choices[0].delta.content or ""
    print(chunk_message, end="")
    collected_messages.append(chunk_message)

# Save the assistant's response
messages.append(
    {
        "role": "assistant",
        "content": "".join(collected_messages)
    }
)

# Continue the conversation
print(
    "\n\nYou can continue the conversation, type 'change topic' to select a different option, or 'goodbye' to end the chat.")

while True:
    user_input = input("\n> ")

    # Check if user wants to exit
    if user_input.lower() in ["goodbye", "bye", "exit", "quit"]:
        print("\nThank you for chatting about Indian cuisine! Gaumarjos! (Cheers!)")
        break

    # Check if user wants to change topic
    if user_input.lower() in ["change topic", "new topic", "switch"]:
        print("\nWhat would you like help with now?")
        print("a. Finding an Indian dish based on ingredients you have")
        print("b. Getting a recipe for a specific Indian dish")
        print("c. Discussing improvements for an Indian recipe you've tried")

        choice = input("\nPlease enter your choice (a, b, or c): ").strip().lower()

        if choice == 'a':
            ingredients = input("\nWhat ingredients do you have on hand? ")
            user_input = f"I have {ingredients}. What Indian dish could I make with these?"
        elif choice == 'b':
            dish = input("\nWhich Indian dish would you like the recipe for? ")
            user_input = f"I'd love to learn how to make {dish}. Can you share a detailed recipe and preparation steps?"
        elif choice == 'c':
            dish = input("\nWhich Indian dish have you tried making? ")
            feedback = input("What would you like to improve about it? ")
            user_input = f"I tried making {dish} but {feedback}. Do you have any suggestions for improvement?"
        else:
            print("I didn't understand that. Continuing with your previous question.")

    messages.append(
        {
            "role": "user",
            "content": user_input
        }
    )

    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        stream=True,
    )

    collected_messages = []
    for chunk in stream:
        chunk_message = chunk.choices[0].delta.content or ""
        print(chunk_message, end="")
        collected_messages.append(chunk_message)

    messages.append(
        {
            "role": "assistant",
            "content": "".join(collected_messages)
        }
    )




