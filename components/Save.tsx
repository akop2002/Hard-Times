
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PriceReport } from '../types';
import Card from './common/Card';

// Mock Data
const MOCK_REPORTS: PriceReport[] = [
  { id: 1, item: '1 Gallon Milk', price: 3.89, store: 'SuperMart', distance: 1.2 },
  { id: 2, item: 'Dozen Eggs', price: 2.99, store: 'Grocer A', distance: 2.5 },
  { id: 3, item: 'Loaf of Bread', price: 2.50, store: 'Corner Store', distance: 0.8 },
  { id: 4, item: '1 Gallon Milk', price: 3.99, store: 'Grocer A', distance: 2.5 },
  { id: 5, item: 'Dozen Eggs', price: 2.79, store: 'SuperMart', distance: 1.2 },
  { id: 6, item: 'Loaf of Bread', price: 2.75, store: 'SuperMart', distance: 1.2 },
  { id: 7, item: 'Avocado', price: 1.50, store: 'Grocer A', distance: 2.5 },
  { id: 8, item: '1lb Ground Beef', price: 5.49, store: 'SuperMart', distance: 1.2 },
  { id: 9, item: '1lb Ground Beef', price: 5.29, store: 'Butcher Shop', distance: 4.1 },
  { id: 10, item: 'Cereal Box', price: 4.50, store: 'Grocer A', distance: 2.5 },
  { id: 11, item: 'Cereal Box', price: 4.25, store: 'SuperMart', distance: 1.2 },
  { id: 12, item: 'Dozen Eggs', price: 3.15, store: 'Corner Store', distance: 0.8 },
];

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);


const Save: React.FC = () => {
    const [reports, setReports] = useState<PriceReport[]>(MOCK_REPORTS);
    const [userLocation, setUserLocation] = useState<string>('Fetching location...');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reportsSubmitted, setReportsSubmitted] = useState(0);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation(`Near Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`);
            },
            () => {
                setUserLocation('Location access denied.');
            }
        );
    }, []);

    const groupedReports = useMemo(() => {
        const groups: { [key: string]: PriceReport[] } = {};
        reports.forEach(report => {
            if (!groups[report.item]) {
                groups[report.item] = [];
            }
            groups[report.item].push(report);
        });

        // Sort each group by price
        Object.keys(groups).forEach(item => {
            groups[item].sort((a, b) => a.price - b.price);
        });

        return groups;
    }, [reports]);

    const handleSubmission = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (reportsSubmitted >= 10) {
            alert("Free users can submit up to 10 reports per month.");
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const newItem: PriceReport = {
            id: reports.length + 1,
            item: formData.get('item') as string,
            price: parseFloat(formData.get('price') as string),
            store: formData.get('store') as string,
            distance: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // Mock distance
        };

        setTimeout(() => { // Simulate network request
            setReports(prev => [...prev, newItem]);
            setReportsSubmitted(prev => prev + 1);
            setIsSubmitting(false);
            (event.target as HTMLFormElement).reset();
        }, 1000);
    }, [reports.length, reportsSubmitted]);

    const canSubmit = reportsSubmitted < 10;
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Community Price Watch</h2>
                <p className="text-slate-400">Find the cheapest groceries and essentials reported by people near you. Current location: <span className="font-semibold text-cyan-400">{userLocation}</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-xl font-bold text-white mb-4">Report a Price</h3>
                        <form className="space-y-4" onSubmit={handleSubmission}>
                            <div>
                                <label htmlFor="item" className="block mb-2 text-sm font-medium text-slate-300">Item Name</label>
                                <input type="text" name="item" required placeholder="e.g., Dozen Eggs" className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-slate-300">Price ($)</label>
                                    <input type="number" name="price" step="0.01" required placeholder="2.99" className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="store" className="block mb-2 text-sm font-medium text-slate-300">Store</label>
                                    <input type="text" name="store" required placeholder="Grocer A" className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="photo" className="block mb-2 text-sm font-medium text-slate-300">Photo (Optional)</label>
                                <input type="file" name="photo" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900 file:text-cyan-300 hover:file:bg-cyan-800"/>
                            </div>
                            <button type="submit" disabled={!canSubmit || isSubmitting} className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white font-bold py-2.5 px-5 rounded-lg transition">
                                {isSubmitting ? 'Submitting...' : 'Submit Report'}
                            </button>
                            <p className="text-xs text-center text-slate-500">You have {10 - reportsSubmitted} reports left this month.</p>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-xl font-bold text-white mb-4">Cheapest Essentials Nearby</h3>
                         <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {Object.entries(groupedReports).map(([item, rankedReports]) => (
                                <div key={item}>
                                    <h4 className="font-bold text-lg text-cyan-400">{item}</h4>
                                    <div className="mt-2 space-y-2 relative">
                                        {rankedReports.slice(0, 3).map((report, index) => (
                                            <div key={report.id} className={`flex justify-between items-center p-3 rounded-lg ${index === 0 ? 'bg-green-500/20 border border-green-500' : 'bg-slate-700/50'}`}>
                                                <div>
                                                    <span className="font-semibold text-white">{report.store}</span>
                                                    <span className="text-sm text-slate-400 ml-2">({report.distance}km away)</span>
                                                </div>
                                                <span className="font-bold text-xl text-white">${report.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                        {rankedReports.length > 3 && (
                                            <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                                                <LockIcon />
                                                <p className="font-bold text-white">Upgrade to Pro</p>
                                                <p className="text-slate-300 text-sm">to see all {rankedReports.length} results</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Save;
