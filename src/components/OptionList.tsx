import { useState } from 'react'

import {
    TextField,
    Button,
    ButtonGroup,
    Box,
    Container,
    CssBaseline,
    Link,
    Typography,
} from '@mui/material'

import useStore from '../useStore'

export default function OptionList() {
    const { apiToken, setApiToken, clearStorage } = useStore((state) => {
        return {
            apiToken: state.apiToken,
            setApiToken: state.setApiToken,
            clearStorage: state.clearStorage
        }
    })

    const [tempApiToken, setTempApiToken] = useState(apiToken)

    const handleReset = () => {
        clearStorage()
        setTempApiToken('')
    }

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
                Customizations in the way, source-code available <Link href="https://github.com/rzfzr/toboard-extension">here</Link>.
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                onReset={handleReset}

                noValidate sx={{ mt: 1 }}>
                <TextField
                    value={tempApiToken}
                    onChange={(event) => { setTempApiToken(event.target.value) }}
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

                <ButtonGroup
                    fullWidth
                    variant="contained"
                    aria-label="outlined primary button group">
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save
                    </Button>
                    <Button
                        color='secondary'
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => {
                            chrome.tabs.update({ url: "chrome://newtab" })
                        }} >
                        Go Home
                    </Button>
                    <Button
                        type='reset'
                        color={status === 'clear' ? 'success' : 'error'}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset All
                    </Button>
                </ButtonGroup>
            </Box>
        </Box>
    </Container>
}