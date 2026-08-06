import { useEffect, useState } from "react";
import { getHiringPipelineData } from "../services/hiringPipelineService";

export default function useHiringPipeline() {
  const [pipeline, setPipeline] = useState(null);

  useEffect(() => {
    async function loadPipeline() {
      const data = await getHiringPipelineData();
      setPipeline(data);
    }

    loadPipeline();
  }, []);

  return pipeline;
}