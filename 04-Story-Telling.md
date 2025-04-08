# Building a Storytelling Application

1. Start a new project with the NextJS AI SDK

   - This will set up a new project for you using Next.js templates

   - Open your terminal and type the following command:

   `npx create-next-app story-telling-app`

2. Choose all default options

   - When asked `Ok to proceed? (y)` press 'Enter' to confirm

   - When asked `Would you like to use TypeScript? › No / Yes` pick default option `Yes`

   - When asked `Would you like to use ESLint? › No / Yes` pick default option `Yes`

   - When asked `Would you like to use Tailwind CSS? › No / Yes` pick default option `Yes`

   - When asked `Would you like to use src/ directory? › No / Yes` pick default option `No`

   - When asked `Would you like to use App Router? (recommended) › No / Yes` pick default option `Yes`

   - When asked `Would you like to customize the default import alias (@/*)?` pick default option `No`

   - Wait for the installation to finish

3. Navigate to the created folder

   - The command you executed in step 1 created a new folder called 'story-telling-app'

   - Navigate into this folder by using the following command:

   `cd story-telling-app`

4. Install the suggested dependencies

   - These libraries are required for your project to run

   - Install them with the following command:

   `npm install ai openai`

   - Wait for the installation to finish

5. Open the project in VSCode

   - Visual Studio Code (VSCode) is a code editor where you can write and manage your code

   - Use the following command to open your project in VSCode:

   `code .`

   - Alternatively, you can open it manually by finding the 'my-ai-app' folder on your computer, right-clicking it, and choosing 'Open with VSCode'

   - If you don't have the 'Open with VSCode' option, you can open VSCode and use the 'File' > 'Open Folder' option to navigate to the 'my-ai-app' folder

6. Create a new file for instructing NextJS how to handle the API calls:

   - In the root of your project, find the `app` folder and create a new folder inside it named `api`

   - Inside the `api` folder, create another new folder named `chat`

   - Inside the `chat` folder, create a new file named `route.ts`

   - Open the `route.ts` file and paste the following code. This will set up the AI to act as a storyteller:

   ```typescript
   import OpenAI from "openai";
   import { OpenAIStream, StreamingTextResponse } from "ai";

   const openai = new OpenAI();

   export const runtime = "edge";

   export async function POST(req: Request) {
     const { messages } = await req.json();

     const response = await openai.chat.completions.create({
       model: "gpt-4o-mini",
       stream: true,
       messages: [
         {
           role: "system",
           content: `You are a professional storyteller who has been hired to write a series of short stories for a new anthology. The stories should be captivating, imaginative, and thought-provoking. They should explore a variety of themes and genres, from science fiction and fantasy to mystery and romance. Each story should be unique and memorable, with compelling characters and unexpected plot twists.`,
         },
         ...messages,
       ],
     });

     const stream = OpenAIStream(response);
     return new StreamingTextResponse(stream);
   }
   ```

7. Update the `page.tsx` file by adding a basic description of the app and placeholders for the code that will be added in the subsequent steps:

   ```tsx
   "use client";

   export default function Chat() {
     return (
       <main className="mx-auto w-full p-24 flex flex-col">
         <div className="p4 m-4">
           <div className="flex flex-col items-center justify-center space-y-8 text-white">
             <div className="space-y-2">
               <h2 className="text-3xl font-bold">Story Telling App</h2>
               <p className="text-zinc-500 dark:text-zinc-400">
                 Customize the story by selecting the genre and tone.
               </p>
             </div>

             {/* genre selection code */}

             {/* tone selection code */}

             {/* button code */}

             {/* chat messages code */}
           </div>
         </div>
       </main>
     );
   }
   ```

8. Set up the necessary elements before proceeding to add the functionalities

   - At the top of the code, below `"use client";`, import the `useState` and `useChat` hooks. Then, destructure append, messages, and isLoading from the `useChat` hook:

   ```tsx
   "use client";

   import { useState } from "react";
   import { useChat } from "ai/react";

   export default function Chat() {
     const { messages, append, isLoading } = useChat();

   // rest of the code...
   ```

   - Create two lists of story genres and tones below the code from the previous step:

   ```tsx
   const genres = [
     { emoji: "🧙", value: "Fantasy" },
     { emoji: "🕵️", value: "Mystery" },
     { emoji: "💑", value: "Romance" },
     { emoji: "🚀", value: "Sci-Fi" },
   ];
   const tones = [
     { emoji: "😊", value: "Happy" },
     { emoji: "😢", value: "Sad" },
     { emoji: "😏", value: "Sarcastic" },
     { emoji: "😂", value: "Funny" },
   ];
   ```

   - Now let's create a state to control the selected genre and tone and a function to change it. Place it below the code from the previous step:

   ```tsx
   const [state, setState] = useState({
     genre: "",
     tone: "",
   });

   const handleChange = ({
     target: { name, value },
   }: React.ChangeEvent<HTMLInputElement>) => {
     setState({
       ...state,
       [name]: value,
     });
   };
   ```

   - The code at this point should look like this:

   ```tsx
   "use client";

   import { useState } from "react";
   import { useChat } from "ai/react";

   export default function Chat() {
     const { messages, append, isLoading } = useChat();
     const genres = [
       { emoji: "🧙", value: "Fantasy" },
       { emoji: "🕵️", value: "Mystery" },
       { emoji: "💑", value: "Romance" },
       { emoji: "🚀", value: "Sci-Fi" },
     ];
     const tones = [
       { emoji: "😊", value: "Happy" },
       { emoji: "😢", value: "Sad" },
       { emoji: "😏", value: "Sarcastic" },
       { emoji: "😂", value: "Funny" },
     ];

     const [state, setState] = useState({
       genre: "",
       tone: "",
     });

     const handleChange = ({
       target: { name, value },
     }: React.ChangeEvent<HTMLInputElement>) => {
       setState({
         ...state,
         [name]: value,
       });
     };

   // rest of the code
   ```

9. Include radio buttons of story genres for the user to select

   - Replace `{/* genre selection code */}` with the following code:

   ```tsx
   <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
     <h3 className="text-xl font-semibold">Genre</h3>

     <div className="flex flex-wrap justify-center">
       {genres.map(({ value, emoji }) => (
         <div
           key={value}
           className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
         >
           <input
             id={value}
             type="radio"
             value={value}
             name="genre"
             onChange={handleChange}
           />
           <label className="ml-2" htmlFor={value}>
             {`${emoji} ${value}`}
           </label>
         </div>
       ))}
     </div>
   </div>
   ```

10. Include radio buttons for the user to select the tone of the story

    - Replace `{/* tone selection code */}` with the following code:

    ```tsx
    <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
      <h3 className="text-xl font-semibold">Tones</h3>

      <div className="flex flex-wrap justify-center">
        {tones.map(({ value, emoji }) => (
          <div
            key={value}
            className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
          >
            <input
              id={value}
              type="radio"
              name="tone"
              value={value}
              onChange={handleChange}
            />
            <label className="ml-2" htmlFor={value}>
              {`${emoji} ${value}`}
            </label>
          </div>
        ))}
      </div>
    </div>
    ```

11. Include a button for the user to generate the story

    - Replace `{/* button selection code */}` with the following code:

    ```tsx
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      disabled={isLoading || !state.genre || !state.tone}
      onClick={() =>
        append({
          role: "user",
          content: `Generate a ${state.genre} story in a ${state.tone} tone`,
        })
      }
    >
      Generate Story
    </button>
    ```

12. Include an element to display the generated story

    - Replace `{/* chat messages code */}` with the following code:

    ```tsx
    <div
      hidden={
        messages.length === 0 ||
        messages[messages.length - 1]?.content.startsWith("Generate")
      }
      className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
    >
      {messages[messages.length - 1]?.content}
    </div>
    ```

13. The final code should look like this:

    ```tsx
    "use client";

    import { useState } from "react";
    import { useChat } from "ai/react";

    export default function Chat() {
      const { messages, append, isLoading } = useChat();
      const genres = [
        { emoji: "🧙", value: "Fantasy" },
        { emoji: "🕵️", value: "Mystery" },
        { emoji: "💑", value: "Romance" },
        { emoji: "🚀", value: "Sci-Fi" },
      ];
      const tones = [
        { emoji: "😊", value: "Happy" },
        { emoji: "😢", value: "Sad" },
        { emoji: "😏", value: "Sarcastic" },
        { emoji: "😂", value: "Funny" },
      ];

      const [state, setState] = useState({
        genre: "",
        tone: "",
      });

      const handleChange = ({
        target: { name, value },
      }: React.ChangeEvent<HTMLInputElement>) => {
        setState({
          ...state,
          [name]: value,
        });
      };

      return (
        <main className="mx-auto w-full p-24 flex flex-col">
          <div className="p4 m-4">
            <div className="flex flex-col items-center justify-center space-y-8 text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Story Telling App</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Customize the story by selecting the genre and tone.
                </p>
              </div>

              <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-semibold">Genre</h3>

                <div className="flex flex-wrap justify-center">
                  {genres.map(({ value, emoji }) => (
                    <div
                      key={value}
                      className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                    >
                      <input
                        id={value}
                        type="radio"
                        value={value}
                        name="genre"
                        onChange={handleChange}
                      />
                      <label className="ml-2" htmlFor={value}>
                        {`${emoji} ${value}`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-semibold">Tones</h3>

                <div className="flex flex-wrap justify-center">
                  {tones.map(({ value, emoji }) => (
                    <div
                      key={value}
                      className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                    >
                      <input
                        id={value}
                        type="radio"
                        name="tone"
                        value={value}
                        onChange={handleChange}
                      />
                      <label className="ml-2" htmlFor={value}>
                        {`${emoji} ${value}`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading || !state.genre || !state.tone}
                onClick={() =>
                  append({
                    role: "user",
                    content: `Generate a ${state.genre} story in a ${state.tone} tone`,
                  })
                }
              >
                Generate Story
              </button>

              <div
                hidden={
                  messages.length === 0 ||
                  messages[messages.length - 1]?.content.startsWith("Generate")
                }
                className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
              >
                {messages[messages.length - 1]?.content}
              </div>
            </div>
          </div>
        </main>
      );
    }
    ```

14. Test the app to evaluate how the AI responds to the user's requests

    - Run the app by executing the following command on the terminal:

    ```bash
    npm run dev
    ```
