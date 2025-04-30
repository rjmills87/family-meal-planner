import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Create from './Create';

// Define the type for a meal suggestion
type MealSuggestion = {
    id: number;
    title: string;
    description: string | null;
    week_number: number;
    user: {
        id: number;
        name: string;
    };
};

// Define the props for our component
type Props = {
    mealSuggestions: MealSuggestion[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Meal Suggestions',
        href: '/meal-suggestions',
    },
];

export default function Index({ mealSuggestions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meal Suggestions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Meal Suggestions</h2>
                                <Create />
                            </div>
                            {mealSuggestions.length === 0 ? (
                                <p>No meal suggestions yet. Create your first one!</p>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Week</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Suggested By
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {mealSuggestions.map((suggestion) => (
                                            <tr key={suggestion.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{suggestion.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">Week {suggestion.week_number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{suggestion.user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={route('meal-suggestions.show', suggestion.id)}
                                                        className="mr-2 text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
