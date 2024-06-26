import {
    TextField,
    Button,
    Box,
    Typography,
    Link,
    Container,
    CssBaseline
} from '@mui/material'

import useStore from '../useStore'
import { useState } from 'react'

export default function OptionList() {
    const setApiToken = useStore((state) => state.setApiToken)
    const [error, setError] = useState('')


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const apiToken = data.get('apiToken') as string

        if (apiToken?.length == 32) {
            setApiToken(apiToken)
        } else {
            setError('Please provide a valid API key.')
        }
    }

    return <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Please provide your API key.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="apiToken"
                    label="API Key"
                    name="apiToken"
                    autoFocus
                    error={!!error}
                    helperText={error}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Save
                </Button>

                <Link href="https://support.toggl.com/en/articles/3116844-where-is-my-api-key-located" variant="body2">
                    How to find your API key</Link>
            </Box>
        </Box>
    </Container>
}