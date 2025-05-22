import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

// Helper function to get the current week number
function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default function Create() {
    // Get the current date to set default values
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();

    const { data, setData, post, processing, errors } = useForm({
        week_number: currentWeek,
        year: currentYear,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('meal-plans.store'));
    };

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>Create New Plan</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create a Meal Plan</DialogTitle>
                        <DialogDescription>Creat a meal plan for week {data.week_number}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="mb-4">
                            <Label htmlFor="week_number" className="mb-2 block text-sm font-medium text-gray-700">
                                Week Number
                            </Label>
                            <Input
                                type="number"
                                id="week_number"
                                name="week_number"
                                min="1"
                                max="52"
                                value={data.week_number}
                                onChange={(e) => setData('week_number', parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.week_number && <div className="mt-1 text-sm text-red-600">{errors.week_number}</div>}
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="year" className="mb-2 block text-sm font-medium text-gray-700">
                                Year
                            </Label>
                            <Input
                                type="number"
                                id="year"
                                name="year"
                                min={currentYear}
                                value={data.year}
                                onChange={(e) => setData('year', parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.year && <div className="mt-1 text-sm text-red-600">{errors.year}</div>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Meal Plan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
