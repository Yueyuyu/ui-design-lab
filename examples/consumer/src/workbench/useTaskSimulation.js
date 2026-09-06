import { useEffect, useRef, useState } from "react";
import { initialTasks } from "./demo-data.js";
export function useTaskSimulation() {
  const [tasks, setTasks] = useState(initialTasks),
    timers = useRef(new Map());
  useEffect(() => () => {
    timers.current.forEach(clearInterval);
  }, []);
  const run = id => {
    if (timers.current.has(id)) return;
    setTasks(v => v.map(t => t.id === id ? {
      ...t,
      status: "执行中",
      progress: 0,
      history: [...t.history, "开始本地模拟执行"]
    } : t));
    let progress = 0;
    const timer = setInterval(() => {
      progress += 20;
      setTasks(v => v.map(t => t.id === id ? {
        ...t,
        progress,
        status: progress === 100 ? "已完成" : "执行中",
        usage: progress === 100 ? t.usage + 20 : t.usage,
        result: progress === 100 ? "本地模拟结果：已完成流程验证，可接入真实任务适配器。" : t.result,
        history: progress === 100 ? [...t.history, "本地模拟完成"] : t.history
      } : t));
      if (progress === 100) {
        clearInterval(timer);
        timers.current.delete(id);
      }
    }, 350);
    timers.current.set(id, timer);
  };
  const cancel = id => {
    clearInterval(timers.current.get(id));
    timers.current.delete(id);
    setTasks(v => v.map(t => t.id === id ? {
      ...t,
      status: "已取消",
      history: [...t.history, "取消本地任务"]
    } : t));
  };
  return {
    tasks,
    setTasks,
    run,
    cancel
  };
}
