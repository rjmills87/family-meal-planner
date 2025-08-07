import CalendarView from '@/components/calendar-view';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import Edit from './Edit';

// Define the types for our component
type MealSuggestion = {
    id: number;
    title: string;
    description: string | null;
};

type MealPlanItem = {
    id: number;
    day_of_week: number;
    meal_suggestion: MealSuggestion;
};

type MealPlan = {
    id: number;
    week_number: number;
    year: number;
    status: string;
    created_at: string;
    creator: {
        id: number;
        name: string;
    };
    items: MealPlanItem[];
};

type Props = {
    mealPlan: MealPlan;
};

// Map day numbers to day names
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Show({ mealPlan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Meal Plans',
            href: '/meal-plans',
        },
        {
            title: `Week ${mealPlan.week_number}, ${mealPlan.year}`,
            href: `/meal-plans/${mealPlan.id}`,
        },
    ];

    // Sort items by day of week
    const sortedItems = [...mealPlan.items].sort((a, b) => a.day_of_week - b.day_of_week);

    const { delete: destroy } = useForm();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const deleteSuggestion = () => {
        setDeleteDialogOpen(true);
    };

    // Handle meal plan deletion
    const confirmDelete = () => {
        destroy(route('meal-plans.destroy', mealPlan.id), {
            onSuccess: () => {
                toast('Your Meal Plan has successfully been deleted.');
                setDeleteDialogOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Meal Plan: Week ${mealPlan.week_number}, ${mealPlan.year}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Meal Plan: Week {mealPlan.week_number}, {mealPlan.year}
                                    </h2>
                                    <p className="text-sm text-gray-500">Created by {mealPlan.creator.name}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Edit mealPlan={mealPlan} />
                                    <Button
                                        variant="destructive"
                                        className="cursor-pointer bg-red-500 transition-colors duration-300 ease-in-out hover:bg-red-700"
                                        onClick={deleteSuggestion}
                                    >
                                        Delete Suggestion
                                    </Button>
                                </div>
                            </div>

                            <div
                                className="mb-4 inline-flex rounded-full px-3 py-1 text-sm leading-5 font-semibold capitalize"
                                style={{
                                    backgroundColor: mealPlan.status === 'published' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(250, 204, 21, 0.2)',
                                    color: mealPlan.status === 'published' ? 'rgb(22, 101, 52)' : 'rgb(161, 98, 7)',
                                }}
                            >
                                {mealPlan.status}
                            </div>
                            <div className="mt-6">
                                <h3 className="mb-4 text-lg font-medium">Weekly Meal Schedule</h3>

                                {/* Calendar View */}
                                <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    {sortedItems.length === 0 ? (
                                        <p className="p-4 text-gray-500">No meals have been added to this plan yet.</p>
                                    ) : (
                                        <CalendarView items={sortedItems} />
                                    )}
                                </div>

                                {/* List View */}
                                <h4 className="text-md mb-4 font-medium">Meal List</h4>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    {sortedItems.length === 0 ? (
                                        <p className="p-4 text-gray-500">No meals have been added to this plan yet.</p>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {sortedItems.map((item) => (
                                                <div key={item.id} className="flex items-center p-4 hover:bg-gray-50">
                                                    <div className="w-32 font-medium">{dayNames[item.day_of_week - 1]}</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{item.meal_suggestion.title}</h4>
                                                        {item.meal_suggestion.description && (
                                                            <p className="mt-1 text-sm text-gray-500">{item.meal_suggestion.description}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={route('meal-suggestions.show', item.meal_suggestion.id)}
                                                            className="text-sm text-blue-600 hover:text-blue-900"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Meal Plan</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this Meal Plan? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
