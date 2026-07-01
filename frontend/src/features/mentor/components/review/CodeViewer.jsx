export default function CodeViewer({ code }) {

  return (

    <pre className="bg-[#1E1E1E] text-white h-[650px] overflow-auto p-8 text-sm leading-8 whitespace-pre-wrap">

      {code}

    </pre>

  );

}