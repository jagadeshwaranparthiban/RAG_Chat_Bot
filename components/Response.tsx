// Simple formatter: headings, line breaks, bullet points
const formatText = (text: string) => {
  // Replace escaped newlines with actual newlines
  const cleanedText = text.replace(/\\n/g, '\n');
  // Headings: lines starting with 'Result' or 'Answer:'
  const lines = cleanedText.split(/\r?\n/);
  return lines.map((line, idx) => {
    if (/^\s*(answer|result|context)[:：]/i.test(line)) {
      return <h3 key={idx} className="text-xl font-bold mt-4 mb-2">{line}</h3>;
    }
    if (/^\s*[-*•]/.test(line)) {
      return <li key={idx} className="ml-6 list-disc">{line.replace(/^\s*[-*•]\s*/, "")}</li>;
    }
    if (line.trim() === "") {
      return <br key={idx} />;
    }
    return <p key={idx} className="mb-1">{line}</p>;
  });
};

const Response = ({ text }:{ text:string }) => {
  return (
    <div className={`px-4 py-2 max-h-[70vh] w-full mb-40 text-white font-medium flex justify-start overflow-x-hidden max-w-4xl overflow-y-auto rounded-md scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300 self-start`}>
      <div className="w-full">{formatText(text)}</div>
    </div>
  )
}

export default Response