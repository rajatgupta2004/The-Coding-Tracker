

interface UserData {
    _id: string;
    name: string;
    roll: string;
    gmail: string;
    phone: string;
    passingYear: string;
    branch: string;
    section: string;
    lcUsername: string;
    cfUsername: string;
    ccUsername: string;
    ggUsername: string;
    lcEasy: number;
    lcMedium: number;
    lcHard: number;
    lcTotal: number;
    cfRank: string;
    cfRating: number;
    cfTotal: number;
    ccRank: string;
    ccRating: number;
    ccTotal: number;
    ggTotal: number;
    Total: number
}
// Type for context data
export interface ContextType {
    sampleData: UserData[];
    loading: boolean;
    setSampleData: React.Dispatch<React.SetStateAction<UserData[]>>;
}

export default UserData;