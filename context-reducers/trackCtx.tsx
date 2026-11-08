import { createContext, useContext, useReducer } from "react";

type Frequency = "daily" | "weekly" | "monthly"

type insights = {
    suggestions: string[];
    areasOfImprovement: string[];
    strengths: string[];
    actions: string[];
    dailySummary: string
}

export type Steps = {
    id: string;
    title: string;
    time: string;
    completed: boolean;
    notes?: string;
    photo?: string;
    voiceNote?: string;
    // this needs to be included within step data update so that each changes doesnt affect on other date steps o track page
    datestamp?: string; // added datestamp to steps to identify which step belongs to which date in daily timeline and also to avoid confusion of showing same notes for different datestamps as it is not possible to have same notes for different datestamps for same step and it will create confusion as well
}

export type TrackTypes = {
    id: string;
    title: string;
    description: string;
    frequency: Frequency;
    duration: number;
    measurement: {
        metric: string;
        target: number;
    };
    steps: Steps[];
    successDefinition: {
        enabled: boolean;
        percentage: number;
    };
    createdAt: Date;
    currentStreak: number;
    totalCompleted: number;
}

type HeatmapDay = {
    date: Date
    value: number // 0-100
}

export type MonthlyProps = {
    month: Number // 1-12 representing the month for which the heatmap data is being stored. This will help in identifying which month's data is being represented in the heatmap.
    data: HeatmapDay[] // 0-100 values for each day in the month which will determine the intensity of the color in the heatmap. that 0 to 100 values represents the percentage of completion of the habit for that day. for example if the habit is to drink 2 liters of water daily and on a particular day the user drinks 1 liter of water then the value for that day will be 50.
}

export type initialStateTypes = {
    habits: TrackTypes[],
    habitViewing: number,
    habitInsights: {
        insights: insights | null,
        habitId: number | string | null,
        weekly: string | null,
        monthly: MonthlyProps[] | null,
        // instead of directly updating habit steps came from ai insights for habits we will keep it in insights and then await user action to add those steps to habit steps. So that user stays in control of any ddition from ai insights to its habit data.
        daily: Steps[] | null,
        dailySummary: string | null
    }[],
    completionRate: {
        habitId: number | string,
        weeks: {
            weekStart: Date,
            weekEnd: Date,
            totalCompleted: number,
            totalSteps: number,
            percentile: number, // 0-100 percentage
        }[]
    }[],
    dailyLogs: {
        habitId: number | string,
        logs: {
            ids: string[],
            log_ids_with_notes: { id: string, notes: string }[],
            date: Date,
            notes: string,
            totalSteps: number,
            percentile: number, // 0-100 percentage
        }[]
    }[]
}


const trackReducer = (state: initialStateTypes, action: { type: string, payload: any }) => {
    const updateCorrectly = () => {
        const existing = state.habitInsights
        const payload = action.payload

        const updateExistingWhenMatchesPayload = existing.map((ins) => {
            if (ins.habitId == payload.habitId) {
                return {
                    ...ins,
                    insights: payload.insights
                }
            }
            return ins
        })

        const whenNotFoundInExistingAddPayload = updateExistingWhenMatchesPayload.findIndex((ins) => ins.habitId == payload.habitId) == -1 ? [...updateExistingWhenMatchesPayload, {
            insights: payload.insights,
            habitId: payload.habitId,
            weekly: state.habitInsights.find(insight => insight.habitId === payload.habitId)?.weekly || null,
            monthly: state.habitInsights.find(insight => insight.habitId === payload.habitId)?.monthly || null,
            daily: state.habitInsights.find(insight => insight.habitId === payload.habitId)?.daily || null,
            dailySummary: state.habitInsights.find(insight => insight.habitId === payload.habitId)?.dailySummary || null
        }] : updateExistingWhenMatchesPayload

        return whenNotFoundInExistingAddPayload
    }

    switch (action.type) {
        case 'IINITIALIZE':
            return {
                ...state,
                habits: action.payload
            }
        case 'CREATE_HABIT':
            return {
                ...state,
                habits: [...state.habits, action.payload]
            }

        case 'DELETE_HABIT':
            const filtered = state.habits.filter((habit) => habit.id != action.payload)

            return {
                ...state,
                habits: filtered,
                habitViewing: action.payload == state.habitViewing ? filtered[0] : state.habitViewing
            }

        case 'UPDATE_HABIT':
            return {
                ...state,
                habits: state.habits.map((habit) => {
                    if (habit.id === action.payload.id) {
                        return action.payload
                    }
                    return habit
                })
            }

        case 'UPDATE_HABIT_PAYLOAD':
            return {
                ...state,
                habits: state.habits.map((habit) => {
                    if (habit.id === action.payload.id) {
                        return {
                            ...habit,
                            ...action.payload.data
                        }
                    }
                    return habit
                })

            }

        case "UPDATE_HABIT_VIEWING":
            return {
                ...state,
                habitViewing: action.payload
            }

        case "DELETE_INSIGHTS_FOR_HABIT":
            return {
                ...state,
                habitInsights: state.habitInsights.filter((insight) => insight.habitId != action.payload.habitId)
            }

        case "ADD_HABIT_STEPS_FROM_AI_INSIGHTS":
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        return {
                            ...insight,
                            daily: action.payload.data.steps
                        }
                    }
                    return insight
                }) : [{
                    insights: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.insights || null,
                    habitId: action.payload.habitId,
                    weekly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.weekly || null,
                    monthly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.monthly || null,
                    daily: action.payload.data.steps,
                    dailySummary: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.dailySummary || null
                }]
            }


        case "SET_INSIGHTS":
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? updateCorrectly() : [{
                    insights: action.payload.insights,
                    habitId: action.payload.habitId,
                    weekly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.weekly || null,
                    monthly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.monthly || null,
                    daily: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.daily || null,
                    dailySummary: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.dailySummary || null
                }]
            }

        case "ADD_A_HABIT_STEP":
            return {
                ...state,
                habits: state.habits.map((habit) => {
                    if (habit.id == action.payload.habitId) {
                        return {
                            ...habit,
                            steps: [...habit.steps, action.payload.newStep]
                        }
                    }
                    return habit
                })

            }

        // case "ADJUST_DAILY_TRACKING_LOG":
        //     return {
        //         ...state,
        //         dailyLogs: state.dailyLogs.length == 0 ? [{
        //             habitId: action.payload.habitId,
        //             logs: [{
        //                 log_ids_with_notes: action.payload.log_ids_with_notes || [],
        //                 date: action.payload.date,
        //                 notes: action.payload.notes,
        //                 totalSteps: action.payload.totalSteps,
        //                 percentile: action.payload.percentile
        //             }]
        //         }] : state.dailyLogs.map((log) => {
        //             if (log.habitId == action.payload.habitId) {
        //                 return {
        //                     ...log,
        //                     logs: log.logs.map((entry) => {
        //                         if (new Date(entry.date).toDateString() == new Date(action.payload.date).toDateString()) {
        //                             return {
        //                                 log_ids_with_notes: action.payload.log_ids_with_notes || [],
        //                                 totalSteps: action.payload.totalSteps,
        //                                 percentile: action.payload.percentile,
        //                                 date: action.payload.date,
        //                                 habitId: action.payload.habitId
        //                             }
        //                         }
        //                         return entry
        //                     })
        //                 }
        //             }
        //             return log
        //         })

        //     }

        // case "ADJUST_DAILY_TRACKING_LOG": {
        //     const { habitId, date, log_ids_with_notes, totalSteps, percentile } = action.payload;
        //     const targetDateStr = new Date(date).toDateString();

        //     // 1. Check if the habit already exists in the logs
        //     const habitExists = state.dailyLogs.some(log => log.habitId == habitId);

        //     if (!habitExists) {
        //         // ADD NEW HABIT to the list
        //         return {
        //             ...state,
        //             dailyLogs: [
        //                 ...state.dailyLogs,
        //                 {
        //                     habitId: habitId,
        //                     logs: [{
        //                         date: date,
        //                         log_ids_with_notes: log_ids_with_notes || [],
        //                         totalSteps: totalSteps,
        //                         percentile: percentile
        //                     }]
        //                 }
        //             ]
        //         };
        //     }

        //     // 2. HABIT EXISTS, so update the specific date entry inside that habit
        //     return {
        //         ...state,
        //         dailyLogs: state.dailyLogs.map((log) => {
        //             if (log.habitId == habitId) {
        //                 return {
        //                     ...log,
        //                     logs: log.logs.map((entry) => {
        //                         if (new Date(entry.date).toDateString() === targetDateStr) {
        //                             return {
        //                                 ...entry, // Keep other existing entry fields
        //                                 log_ids_with_notes: log_ids_with_notes || [],
        //                                 totalSteps: totalSteps,
        //                                 percentile: percentile,
        //                                 date: date
        //                             };
        //                         }
        //                         return entry;
        //                     })
        //                 };
        //             }
        //             return log;
        //         })
        //     };
        // }

        case "ADJUST_DAILY_TRACKING_LOG": {
            const { habitId, date, log_ids_with_notes, totalSteps, percentile } = action.payload
            const target = new Date(date).toDateString()
            const newEntry = { date, log_ids_with_notes: log_ids_with_notes || [], totalSteps, percentile }

            const habitLog = state.dailyLogs.find(l => l.habitId == habitId)
            if (!habitLog) {
                return { ...state, dailyLogs: [...state.dailyLogs, { habitId, logs: [newEntry] }] }
            }

            const hasEntry = habitLog.logs.some(e => new Date(e.date).toDateString() === target)

            return {
                ...state,
                dailyLogs: state.dailyLogs.map(l =>
                    l.habitId != habitId ? l : {
                        ...l,
                        logs: hasEntry
                            ? l.logs.map(e => new Date(e.date).toDateString() === target ? { ...e, ...newEntry } : e)
                            : [...l.logs, newEntry],
                    }
                ),
            }
        }


        case "UPDATE_HABIT_DAILY_TIMELINE":
            return {
                ...state,
                dailyLogs: [{
                    habitId: action.payload[0].habitId,
                    logs: action.payload.map((entry: any) => ({
                        ids: entry.log.map((l: any) => l.toString()),
                        date: entry.dateStamp,
                        notes: entry.notes,
                        totalSteps: entry.totalSteps,
                        percentile: entry.percentile,
                        log_ids_with_notes: entry?.log_ids_with_notes || []
                    }))
                }]
            }

        case "remove-from-habit-suggestions":
            return {
                ...state,
                habitInsights: state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        return {
                            ...insight,
                            insights: {
                                ...insight.insights,
                                suggestions: insight.insights?.suggestions.filter((suggestion) => suggestion !== action.payload.suggestion)
                            }
                        }
                    }
                    return insight
                })
            }

        case "add-weekly-summary-insights":
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        return {
                            ...insight,
                            weekly: action.payload.data
                        }
                    }
                    return insight
                }) : [{
                    insights: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.insights || null,
                    habitId: action.payload.habitId,
                    weekly: action.payload.data,
                    monthly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.monthly || null,
                    daily: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.daily || null,
                    dailySummary: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.dailySummary || null
                }]
            }

        case "add-monthly-heatmap-insights":
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        return {
                            ...insight,
                            monthly: insight.monthly?.find(m => m.month == action.payload.data[0]?.month)
                                ? insight.monthly.map(m => m.month == action.payload.data[0]?.month ? action.payload.data[0] : m)
                                : [...insight.monthly || [], action.payload.data[0]],
                            habitId: action.payload.habitId
                        }
                    }
                    return insight
                }) : [{
                    insights: state.habitInsights.find(insight => insight.habitId == action.payload.habitId)?.insights || null,
                    habitId: action.payload.habitId,
                    weekly: state.habitInsights.find(insight => insight.habitId == action.payload.habitId)?.weekly || null,
                    monthly: action.payload.data,
                    daily: state.habitInsights.find(insight => insight.habitId == action.payload.habitId)?.daily || null,
                    dailySummary: state.habitInsights.find(insight => insight.habitId == action.payload.habitId)?.dailySummary || null
                }]
            }

        case "SET_WEEKLY_COMPLETION_RATE":
            return {
                ...state,
                completionRate: state.completionRate.length > 0 ? state.completionRate.map((rate) => {
                    if (rate.habitId == action.payload.habitId) {
                        return {
                            ...rate,
                            weeks: action.payload.data
                        }
                    }
                    return rate
                }) : [{
                    habitId: action.payload.habitId,
                    weeks: action.payload.data
                }]
            }

        case "SET_A_WEEK_COMPLETION_RATE":
            return {
                ...state,
                completionRate: state.completionRate.length > 0 ? state.completionRate.map((rate) => {
                    if (rate.habitId == action.payload.habitId) {
                        return {
                            ...rate,
                            // we will be updating weekly data based on timestamp which will be start and end of week datestamp to sdecide if it falls within week 1-4 or not and then update that particular week data with new data coming from payload
                            weeks: rate.weeks.map(week => {
                                const dateStamp = new Date(action.payload.dateStamp).getTime()
                                const weekStart = new Date(week.weekStart).getTime()
                                const weekEnd = new Date(week.weekEnd).getTime()
                                if (!week.weekStart || !week.weekEnd) {
                                    // console.log("weekStart or weekEnd is null, adding new week data")
                                    return {
                                        ...week,
                                        weekStart: new Date(action.payload.dateStamp),
                                        weekEnd: new Date(action.payload.dateStamp + 7 * 24 * 60 * 60 * 1000),
                                    }
                                } else if (dateStamp >= weekStart && dateStamp <= weekEnd) {
                                    // console.log("dateStamp is within weekStart and weekEnd, updating week data", (action.payload.data.totalCompleted + (week.totalCompleted || 0)), Number(action.payload.data.totalSteps) + (Number(week.totalSteps) || 0) * 100)
                                    // return action.payload.data
                                    return {
                                        ...week,
                                        totalSteps: action.payload.data.totalSteps + (week.totalSteps || 0), // adding new total steps to existing total steps for that week to get cumulative total steps for that week
                                        totalCompleted: action.payload.data.totalCompleted + (week.totalCompleted || 0), // adding new total completed to existing total completed for that week to get cumulative total completed for that week
                                        percentile: Math.round((action.payload.data.totalCompleted + (week.totalCompleted || 0) / action.payload.data.totalSteps + (week.totalSteps || 0)) * 100)
                                    }
                                } else if (dateStamp > weekEnd) {
                                    // console.log("dateStamp is greater than weekEnd, adding new week data to the end of weeks array")
                                    const prevWeek = rate.weeks[rate.weeks.length - 1]
                                    return [...rate.weeks, {
                                        weekStart: new Date((new Date(prevWeek.weekEnd).getTime() + (24 * 60 * 60 * 1000))), // setting new week start to 1 day after previous week end to avoid overlap
                                        weekEnd: new Date((new Date(prevWeek.weekEnd).getTime() + (24 * 60 * 60 * 1000)) + (7 * 24 * 60 * 60 * 1000)), // 
                                        totalSteps: action.payload.data.totalSteps,
                                        totalCompleted: action.payload.data.totalCompleted,
                                        percentile: Math.round((action.payload.data.totalCompleted / action.payload.data.totalSteps) * 100)
                                    }]
                                } else {
                                    return week
                                }
                            })
                        }
                    }
                    return rate
                }) : [{
                    habitId: action.payload.habitId,
                    weeks: [{
                        ...action.payload.data,
                        weekStart: new Date(action.payload.dateStamp),
                        // get aa date stamp for week end by adding 7 days to week start date
                        weekEnd: new Date(new Date(action.payload.dateStamp).getTime() + (7 * 24 * 60 * 60 * 1000)),
                    }]
                }]
            }


        default:
            return state
    }
}
const initialState: initialStateTypes = {
    habits: [],
    habitViewing: -1,
    habitInsights: [],
    completionRate: [],
    dailyLogs: []
}

const TrackContext = createContext<{
    state: initialStateTypes
    dispatch: React.Dispatch<{ type: string, payload: any }>
}>({
    state: initialState,
    dispatch: () => { }
})

const TrackContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(trackReducer, initialState)
    return (
        <TrackContext.Provider value={{ state, dispatch }}>
            {children}
        </TrackContext.Provider>
    )
}

export default TrackContextProvider

export const useTrackCtx = () => useContext(TrackContext)