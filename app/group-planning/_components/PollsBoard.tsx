import React, { useState } from 'react'
import { Plus, CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'

interface PollsBoardProps {
    tripId: Id<"GroupTrips">;
}

function PollsBoard({ tripId }: PollsBoardProps) {
    const { user } = useUser();
    const trip = useQuery(api.group_trips.getGroupTrip, { id: tripId });
    const createPoll = useMutation(api.group_trips.createPoll);
    const voteOnPoll = useMutation(api.group_trips.vote);

    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const handleAddOption = () => {
        setOptions([...options, '']);
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    }

    const handleCreatePoll = async (e: React.FormEvent) => {
        e.preventDefault();
        const validOptions = options.filter(o => o.trim() !== '');
        if (!question || validOptions.length < 2 || !user) return;

        await createPoll({
            tripId,
            question,
            options: validOptions,
            createdBy: user.id || "test_user_id"
        });
        setOpen(false);
        setQuestion('');
        setOptions(['', '']);
    }

    const handleVote = async (pollId: string, optionId: string) => {
        if (!user) return;
        await voteOnPoll({
            tripId: tripId,
            pollId: pollId,
            optionId: optionId,
        });
    }

    if (!trip) return <div>Loading polls...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Active Polls</h3>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-xl gap-2 border-pink-200 hover:bg-pink-50 hover:text-pink-600 dark:border-pink-900 dark:hover:bg-pink-900/20">
                            <Plus className="w-4 h-4" /> New Poll
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a Poll</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreatePoll} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Question</Label>
                                <Input
                                    placeholder="Where should we stay?"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Options</Label>
                                {options.map((opt, idx) => (
                                    <Input
                                        key={idx}
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        className="mb-2"
                                        required={idx < 2}
                                    />
                                ))}
                                <Button type="button" variant="ghost" size="sm" onClick={handleAddOption} className="text-pink-600">
                                    + Add Option
                                </Button>
                            </div>
                            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                                Create Poll
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {trip.polls.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                        No polls yet. Ask the group something!
                    </div>
                ) : (
                    trip.polls.map((poll: any) => {
                        const totalVotes = poll.options.reduce((acc: number, curr: any) => acc + curr.votes.length, 0);

                        return (
                            <div key={poll.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{poll.question}</h4>
                                <div className="space-y-4">
                                    {poll.options.map((option: any, optIdx: number) => {
                                        const hasVoted = option.votes.includes(user?.id || "test_user_id");
                                        const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);

                                        return (
                                            <div
                                                key={optIdx}
                                                className={`p-3 rounded-xl border transition-all cursor-pointer ${hasVoted
                                                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                                                    : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                                onClick={() => handleVote(poll.id, option.id)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {hasVoted ? (
                                                            <CheckCircle2 className="w-4 h-4 text-pink-500" />
                                                        ) : (
                                                            <Circle className="w-4 h-4 text-gray-300" />
                                                        )}
                                                        <span className={`font-medium ${hasVoted ? 'text-pink-700 dark:text-pink-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                                            {option.text}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-500">{percentage}%</span>
                                                </div>
                                                <Progress value={percentage} className="h-2" indicatorClassName={hasVoted ? 'bg-pink-500' : 'bg-gray-300'} />
                                                <div className="flex -space-x-1 mt-2">
                                                    {option.votes.slice(0, 5).map((voterId: string) => (
                                                        <div key={voterId} className="w-4 h-4 rounded-full bg-gray-200 border border-white dark:border-gray-900" title={voterId} />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-4 text-right text-xs text-gray-400">
                                    {totalVotes} total votes
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default PollsBoard
