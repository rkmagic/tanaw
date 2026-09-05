import { useState } from "react";
import { MapPin, Building2, Euro, Clock, ExternalLink, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
}

// Sample blue-collar jobs across Spain, Germany, and Austria
const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Caregiver / Elderly Care Assistant",
    company: "SeniorCare GmbH",
    location: "Munich",
    country: "Germany",
    salary: "€2,200 - €2,800/month",
    type: "Full-time",
    posted: "2 days ago",
    description: "Provide compassionate care for elderly residents in our care facility. Duties include personal care, meal assistance, and companionship.",
    requirements: ["Basic German (A2+)", "Caregiver certification", "1+ year experience"]
  },
  {
    id: "2",
    title: "Factory Assembly Worker",
    company: "AutoParts España S.L.",
    location: "Barcelona",
    country: "Spain",
    salary: "€1,600 - €2,000/month",
    type: "Full-time",
    posted: "1 day ago",
    description: "Join our automotive parts manufacturing team. Responsible for assembly line operations and quality control.",
    requirements: ["No experience required", "Physical fitness", "Shift work flexibility"]
  },
  {
    id: "3",
    title: "Hotel Housekeeping Staff",
    company: "Grand Hotel Vienna",
    location: "Vienna",
    country: "Austria",
    salary: "€1,800 - €2,200/month",
    type: "Full-time",
    posted: "3 days ago",
    description: "Maintain cleanliness and order in guest rooms and common areas of our 5-star hotel.",
    requirements: ["Attention to detail", "Previous hotel experience preferred", "English or German"]
  },
  {
    id: "4",
    title: "Warehouse Logistics Worker",
    company: "LogiTrans AG",
    location: "Frankfurt",
    country: "Germany",
    salary: "€2,000 - €2,400/month",
    type: "Full-time",
    posted: "5 days ago",
    description: "Handle goods receiving, storage, and shipping in our modern logistics center. Forklift operation included.",
    requirements: ["Forklift license (training provided)", "Physical stamina", "Basic German"]
  },
  {
    id: "5",
    title: "Construction Helper",
    company: "Construcciones Madrid S.A.",
    location: "Madrid",
    country: "Spain",
    salary: "€1,500 - €1,900/month",
    type: "Full-time",
    posted: "1 week ago",
    description: "Assist skilled tradespeople on construction sites. Various tasks including material handling and site preparation.",
    requirements: ["Physical fitness", "Safety awareness", "No experience needed"]
  },
  {
    id: "6",
    title: "Kitchen Staff / Line Cook",
    company: "Gasthaus zur Alm",
    location: "Salzburg",
    country: "Austria",
    salary: "€1,900 - €2,300/month",
    type: "Full-time",
    posted: "4 days ago",
    description: "Prepare traditional Austrian cuisine in our busy restaurant. Support head chef in daily operations.",
    requirements: ["Culinary experience", "Food hygiene certificate", "German helpful"]
  },
  {
    id: "7",
    title: "Agricultural Farm Worker",
    company: "Finca Los Olivos",
    location: "Valencia",
    country: "Spain",
    salary: "€1,400 - €1,700/month",
    type: "Seasonal",
    posted: "6 days ago",
    description: "Seasonal work on olive and citrus farms. Harvesting, planting, and general farm maintenance.",
    requirements: ["Physical endurance", "Outdoor work experience", "Seasonal availability"]
  },
  {
    id: "8",
    title: "Industrial Cleaner",
    company: "CleanPro Industries",
    location: "Berlin",
    country: "Germany",
    salary: "€1,700 - €2,100/month",
    type: "Full-time",
    posted: "3 days ago",
    description: "Professional cleaning of industrial facilities, factories, and commercial buildings.",
    requirements: ["Reliability", "Night/weekend availability", "No experience required"]
  },
  {
    id: "9",
    title: "Delivery Driver",
    company: "ExpressLieferung",
    location: "Innsbruck",
    country: "Austria",
    salary: "€2,100 - €2,500/month",
    type: "Full-time",
    posted: "2 days ago",
    description: "Deliver packages and goods across the Tyrol region. Company vehicle provided.",
    requirements: ["Valid EU driving license", "Clean driving record", "Basic German"]
  }
];

const countries = ["All Countries", "Spain", "Germany", "Austria"];
const jobTypes = ["All Types", "Full-time", "Part-time", "Seasonal"];

interface JobsTabProps {
  userDesiredJob?: string;
  userDesiredCountry?: string;
}

const JobsTab = ({ userDesiredJob, userDesiredCountry }: JobsTabProps) => {
  const [searchTerm, setSearchTerm] = useState(userDesiredJob || "");
  const [selectedCountry, setSelectedCountry] = useState(
    userDesiredCountry && countries.includes(userDesiredCountry) ? userDesiredCountry : "All Countries"
  );
  const [selectedType, setSelectedType] = useState("All Types");

  const filteredJobs = sampleJobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === "All Countries" || job.country === selectedCountry;
    const matchesType = selectedType === "All Types" || job.type === selectedType;
    
    return matchesSearch && matchesCountry && matchesType;
  });

  const getCountryFlag = (country: string) => {
    switch (country) {
      case "Germany": return "🇩🇪";
      case "Spain": return "🇪🇸";
      case "Austria": return "🇦🇹";
      default: return "🌍";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-cream/10 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 text-cream mb-2">
          <Filter className="h-4 w-4" />
          <span className="font-semibold text-sm">Filter Jobs</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs by title, company, or keyword..."
            className="bg-cream/5 border-cream/20 text-cream placeholder:text-cream/40 pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="bg-cream/5 border-cream/20 text-cream flex-1">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-primary border-cream/20">
              {countries.map((country) => (
                <SelectItem key={country} value={country} className="text-cream hover:bg-cream/10">
                  {country !== "All Countries" && `${getCountryFlag(country)} `}{country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-cream/5 border-cream/20 text-cream flex-1">
              <SelectValue placeholder="Job type" />
            </SelectTrigger>
            <SelectContent className="bg-primary border-cream/20">
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-cream hover:bg-cream/10">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-cream/60 text-sm">
          Showing <span className="text-cream font-semibold">{filteredJobs.length}</span> jobs
        </p>
        {selectedCountry !== "All Countries" && (
          <Badge variant="secondary" className="bg-secondary/20 text-secondary border-none">
            {getCountryFlag(selectedCountry)} {selectedCountry}
          </Badge>
        )}
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-cream/5 rounded-xl p-8 text-center">
            <p className="text-cream/60">No jobs found matching your criteria.</p>
            <p className="text-cream/40 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-cream rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-primary text-lg leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-primary/70 font-medium">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-primary/60">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {getCountryFlag(job.country)} {job.location}, {job.country}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Euro className="h-3.5 w-3.5" />
                      {job.salary}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.posted}
                    </span>
                  </div>
                  
                  <p className="mt-3 text-primary/80 text-sm line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-xs">
                      {job.type}
                    </Badge>
                    {job.requirements.slice(0, 2).map((req, idx) => (
                      <Badge key={idx} variant="outline" className="bg-transparent border-primary/20 text-primary/70 text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex sm:flex-col gap-2 sm:items-end">
                  <Button variant="gold" size="sm" className="flex-1 sm:flex-none gap-1">
                    Apply Now
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none border-primary/20 text-primary hover:bg-primary/5">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-cream/40 text-sm">
            More jobs coming soon! We're actively adding new opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobsTab;
