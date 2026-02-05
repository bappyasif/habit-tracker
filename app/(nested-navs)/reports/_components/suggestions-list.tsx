"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { CheckCircle2, Plus, Trash2 } from "lucide-react"

interface Suggestion {
  id: string
  text: string
  accepted: boolean
}

interface SuggestionsListProps {
  suggestions: Suggestion[]
  onAcceptSuggestion: (id: string) => void
  onRejectSuggestion: (id: string) => void
  onCreateNewHabit: (suggestion: string) => void
}

export function SuggestionsList({
  suggestions,
  onAcceptSuggestion,
  onRejectSuggestion,
  onCreateNewHabit,
}: SuggestionsListProps) {
  const activeSuggestions = suggestions.filter((s) => !s.accepted)
  const acceptedSuggestions = suggestions.filter((s) => s.accepted)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actionable Suggestions</CardTitle>
        <CardDescription>AI recommendations to improve your habits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Active Suggestions */}
          {activeSuggestions.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Active</p>
              {activeSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between gap-3 p-3 bg-accent/5 rounded-lg border border-accent/20"
                >
                  <p className="text-sm flex-1">{suggestion.text}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onAcceptSuggestion(suggestion.id)}>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onRejectSuggestion(suggestion.id)}>
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Accepted Suggestions */}
          {acceptedSuggestions.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Accepted</p>
              {acceptedSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <p className="text-sm flex-1 line-through text-muted-foreground">{suggestion.text}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onCreateNewHabit(suggestion.text)
                      onRejectSuggestion(suggestion.id)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add To Habit Steps
                  </Button>
                </div>
              ))}
            </div>
          )}

          {activeSuggestions.length === 0 && acceptedSuggestions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No suggestions at the moment. Keep tracking to get personalized recommendations!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
