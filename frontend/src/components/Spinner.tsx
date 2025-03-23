import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box';
export default function Spinner() {
    return (
        <div className="flex justify-center items-center h-screen bg-blue-100">
            <Box sx={{ display: 'flex' }}>
                <CircularProgress sx={{ color: '#4f46e5' }} />
            </Box>
        </div>
    )
}
