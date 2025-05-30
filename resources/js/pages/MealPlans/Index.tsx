import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Create from './Create';

// Define the type for a meal plan
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
};

type Props = {
    mealPlans: {
        data: MealPlan[];
        links: {
            first: string | null;
            last: string | null;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: Array<{
                url: string | null;
                label: string;
                active: boolean;
            }>;
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Meal Plans',
        href: '/meal-plans',
    },
];

export default function Index({ mealPlans }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meal Plans" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Meal Plans</h2>
                                <Create />
                            </div>

                            {mealPlans.data.length === 0 ? (
                                <p>No meal plans yet. Create your first one!</p>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Week</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Year</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Created By
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {mealPlans.data.map((plan) => (
                                            <tr key={plan.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">Week {plan.week_number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{plan.year}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                            plan.status === 'published'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                    >
                                                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{plan.creator.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link href={route('meal-plans.show', plan.id)} className="mr-2 text-blue-600 hover:text-blue-900">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Pagination links would go here */}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
