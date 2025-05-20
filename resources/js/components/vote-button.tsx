import { router } from '@inertiajs/react';
import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

type VoteButtonProps = {
    mealSuggestionId: number;
    initialVoteCount: number;
};

export default function VoteButton({ mealSuggestionId, initialVoteCount }: VoteButtonProps) {
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = () => {
        setIsVoting(true);

        router.post(
            route('votes.store'),
            {
                meal_suggestion_id: mealSuggestionId,
                value: 1,
            },
            {
                preserveState: true,
                onSuccess: () => {
                    window.location.reload();
                },
                onError: () => {
                    setIsVoting(false);
                },
            },
        );
    };

    return (
        <div className="flex items-center gap-2">
            <Button onClick={handleVote} disabled={isVoting} size="sm" variant="outline" className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                Vote
            </Button>
            <span className="text-sm font-medium">{initialVoteCount} votes</span>
        </div>
    );
}
