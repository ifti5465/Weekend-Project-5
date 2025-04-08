// page.tsx
"use client";
import { useState } from "react";

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

export default function Chat() {
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenre(event.target.value);
  };

  const handleToneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTone(event.target.value);
  };

  const handleGenerateStory = async () => {
    if (genre && tone) {
      setIsLoading(true);
      setStory(""); // Clear previous story

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Generate a ${genre} story in a ${tone} tone.` }],
            genre: genre,
            tone: tone,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          setStory(`Error generating story: ${response.statusText}`);
        } else {
          const reader = response.body?.getReader();
          if (!reader) return;
          const textDecoder = new TextDecoder();
          let partialChunk = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            const chunk = textDecoder.decode(value);
            partialChunk += chunk;

            // Process SSE events
            const events = partialChunk.split('\ndata: ');
            partialChunk = events.pop() || ""; // Keep the last incomplete part

            events.forEach(event => {
              const jsonData = event.trim();
              if (jsonData) {
                try {
                  const parsed = JSON.parse(jsonData);
                  if (parsed?.choices?.[0]?.delta?.content) {
                    setStory((prevStory) => prevStory + parsed.choices[0].delta.content);
                  } else if (parsed?.choices?.[0]?.delta?.role === "assistant") {
                    // Handle initial assistant role if needed
                  } else if (parsed?.finish_reason) {
                    // Handle finish reason if needed
                  } else {
                    console.warn("Unexpected SSE data:", parsed);
                  }
                } catch (e) {
                  console.warn("Could not parse SSE data:", jsonData, e);
                }
              }
            });
          }
        }
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setStory(`Error generating story: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please select both a genre and a tone.");
    }
  };

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Story Telling App (Venice AI)</h2>
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
                    checked={genre === value}
                    onChange={handleGenreChange}
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
                    checked={tone === value}
                    onChange={handleToneChange}
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
            disabled={isLoading || !genre || !tone}
            onClick={handleGenerateStory}
          >
            Generate Story
          </button>

          <div className="bg-opacity-25 bg-gray-700 rounded-lg p-4 whitespace-pre-wrap">
            {isLoading ? <p>Loading...</p> : <p>{story}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}


