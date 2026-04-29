"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

export function MatchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [scoreMin, setScoreMin] = useState(searchParams.get("scoreMin") || "");
  const [scoreMax, setScoreMax] = useState(searchParams.get("scoreMax") || "");
  const [experienceMin, setExperienceMin] = useState(searchParams.get("experienceMin") || "");
  const [experienceMax, setExperienceMax] = useState(searchParams.get("experienceMax") || "");
  const [requiredSkill, setRequiredSkill] = useState(searchParams.get("requiredSkill") || "");
  const [missingSkill, setMissingSkill] = useState(searchParams.get("missingSkill") || "");
  const [recommendation, setRecommendation] = useState(searchParams.get("recommendation") || "");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (scoreMin) params.set("scoreMin", scoreMin);
    if (scoreMax) params.set("scoreMax", scoreMax);
    if (experienceMin) params.set("experienceMin", experienceMin);
    if (experienceMax) params.set("experienceMax", experienceMax);
    if (requiredSkill) params.set("requiredSkill", requiredSkill);
    if (missingSkill) params.set("missingSkill", missingSkill);
    if (recommendation) params.set("recommendation", recommendation);

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setScoreMin("");
    setScoreMax("");
    setExperienceMin("");
    setExperienceMax("");
    setRequiredSkill("");
    setMissingSkill("");
    setRecommendation("");
    router.push(window.location.pathname);
  };

  const activeFiltersCount = [
    scoreMin,
    scoreMax,
    experienceMin,
    experienceMax,
    requiredSkill,
    missingSkill,
    recommendation,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Range */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Score Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Min"
                value={scoreMin}
                onChange={(e) => setScoreMin(e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max"
                value={scoreMax}
                onChange={(e) => setScoreMax(e.target.value)}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Experience Range */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Experience (Years)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Min"
                value={experienceMin}
                onChange={(e) => setExperienceMin(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max"
                value={experienceMax}
                onChange={(e) => setExperienceMax(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Required Skill */}
        <div>
          <Label htmlFor="requiredSkill" className="text-sm font-medium mb-2 block">
            Has Skill
          </Label>
          <Input
            id="requiredSkill"
            type="text"
            placeholder="e.g. React"
            value={requiredSkill}
            onChange={(e) => setRequiredSkill(e.target.value)}
          />
        </div>

        {/* Missing Skill */}
        <div>
          <Label htmlFor="missingSkill" className="text-sm font-medium mb-2 block">
            Missing Skill
          </Label>
          <Input
            id="missingSkill"
            type="text"
            placeholder="e.g. TypeScript"
            value={missingSkill}
            onChange={(e) => setMissingSkill(e.target.value)}
          />
        </div>

        {/* Recommendation */}
        <div>
          <Label htmlFor="recommendation" className="text-sm font-medium mb-2 block">
            Recommendation
          </Label>
          <select
            id="recommendation"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All</option>
            <option value="Strong Fit">Strong Fit</option>
            <option value="Good Fit">Good Fit</option>
            <option value="Moderate Fit">Moderate Fit</option>
            <option value="Weak Fit">Weak Fit</option>
          </select>
        </div>

        {/* Apply Button */}
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
