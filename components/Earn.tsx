
import React, { useState, useCallback, useMemo } from 'react';
import { SideHustlePlan, SideHustleTask, GeminiPlanResponse } from '../types';
import { generateSideHustlePlan } from '../services/geminiService';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';

const LoaderIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);


const Earn: React.FC = () => {
  const [skills, setSkills] = useState('');
  const [time, setTime] = useState('');
  const [constraints, setConstraints] = useState('');
  const [plan, setPlan] = useState<SideHustlePlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planGenerated, setPlanGenerated] = useState(false); // Free user limit

  const handleGeneratePlan = useCallback(async () => {
    if (!skills || !time) {
      setError("Please fill in your skills and available time.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setPlan(null);
    try {
      const response: GeminiPlanResponse = await generateSideHustlePlan(skills, time, constraints);
      const newPlan: SideHustlePlan = {
        idea: response.idea,
        tasks: response.tasks.map((taskDesc, index) => ({
          id: index,
          description: taskDesc,
          completed: false,
        })),
      };
      setPlan(newPlan);
      setPlanGenerated(true);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [skills, time, constraints]);

  const handleTaskToggle = (taskId: number) => {
    setPlan(prevPlan => {
      if (!prevPlan) return null;
      const newTasks = prevPlan.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      return { ...prevPlan, tasks: newTasks };
    });
  };

  const progress = useMemo(() => {
    if (!plan || plan.tasks.length === 0) return 0;
    const completedTasks = plan.tasks.filter(task => task.completed).length;
    return (completedTasks / plan.tasks.length) * 100;
  }, [plan]);
  
  const InputField = ({ id, label, value, onChange, placeholder }: {id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string}) => (
      <div>
          <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
          <input
              type="text"
              id={id}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition"
              disabled={isLoading || planGenerated}
          />
      </div>
  );

  return (
    <div className="space-y-8">
      <div>
          <h2 className="text-3xl font-bold text-white mb-2">Side Hustle Coach</h2>
          <p className="text-slate-400">Tell the AI about yourself and get a personalized side hustle plan.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField id="skills" label="Your Skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., Graphic design, writing, coding" />
            <InputField id="time" label="Time Available" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 5-10 hours a week" />
            <InputField id="constraints" label="Constraints / Resources (Optional)" value={constraints} onChange={(e) => setConstraints(e.target.value)} placeholder="e.g., No startup cost, have a car" />
        </div>
        <div className="mt-6 text-center">
            <button
                onClick={handleGeneratePlan}
                disabled={isLoading || planGenerated}
                className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 inline-flex items-center justify-center"
            >
                {isLoading ? <LoaderIcon /> : (planGenerated ? 'Your Plan is Ready!' : 'Generate My Plan')}
            </button>
            {planGenerated && <p className="text-sm text-slate-500 mt-2">Free users get one plan. Upgrade for unlimited ideas!</p>}
        </div>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </Card>
      
      {plan && (
        <Card>
            <h3 className="text-2xl font-bold text-cyan-400 mb-2">Your Side Hustle Idea:</h3>
            <p className="text-4xl font-bold text-white mb-6">{plan.idea}</p>

            <h4 className="text-xl font-semibold text-white mb-4">Your 5-Step Starter Plan:</h4>
            <div className="space-y-3 mb-6">
                {plan.tasks.map(task => (
                    <div key={task.id} className="flex items-center bg-slate-700/50 p-3 rounded-lg">
                        <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onChange={() => handleTaskToggle(task.id)}
                            className="w-5 h-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 ring-offset-gray-800 focus:ring-2"
                        />
                        <label htmlFor={`task-${task.id}`} className={`ml-3 text-slate-300 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                            {task.description}
                        </label>
                    </div>
                ))}
            </div>
            
            <ProgressBar progress={progress} />

             <div className="mt-8 border-t border-slate-700 pt-6">
                <h4 className="text-lg font-bold text-white mb-4">Go Pro for More!</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <button disabled className="bg-slate-700 text-slate-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed"><LockIcon />Unlimited Plans</button>
                    <button disabled className="bg-slate-700 text-slate-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed"><LockIcon />Set Reminders</button>
                    <button disabled className="bg-slate-700 text-slate-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed"><LockIcon />Export to PDF</button>
                </div>
            </div>
        </Card>
      )}
    </div>
  );
};

export default Earn;
