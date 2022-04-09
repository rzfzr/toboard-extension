import "../global.css";
import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { TextField, Paper, Grid, Button, Box } from '@mui/material';

const darkTheme=createTheme({
    palette: {
        mode: 'dark',
    },
});

function OptionsPage() {
    const [tokenValue, setTokenValue]=useState('');
    const [status, setStatus]=useState('');

    useEffect(() => {
        chrome.storage.local.get(['token'], (result) => {
            setTokenValue(result.token)
        })
    }, [])

    const saveForm=(event) => {
        event.preventDefault();
        chrome.storage.local.set({
            token: tokenValue,
        }, () => {
            setStatus("ok")
            setTimeout(() => {
                setStatus('');
            }, 1*1000);
        });
    }

    const onInput=(event) => setTokenValue(event.target.value)

    return <ThemeProvider theme={darkTheme}>
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ height: '80vh' }}
        >
            <Paper elevation={10} style={{ width: '30%' }}>
                <form onSubmit={saveForm} >
                    <TextField fullWidth value={tokenValue} onInput={onInput} label="API Token" variant="standard" color='primary' />
                    <p>
                        {status==='ok'&&"Form was saved!"}
                    </p>
                    <Button variant="text" type="submit" color={status==='ok'? 'success':'primary'}>Submit</Button>
                    <Button variant="text" color="error" disabled>Reset All</Button>

                </form>
            </Paper>
        </Grid>
    </ThemeProvider>
}

render(<OptionsPage />,
    document.getElementById('app')
);