//@ts-nocheck

import { useState, useEffect } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
    TextField,
    Paper,
    Card,
    CardActions,
    CardContent,
    Grid,
    Button,
    ButtonGroup,
    Box,
    Typography,
    FormControl,
    FormControlLabel,
    InputLabel,
    Switch,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function Options() {
    const [apiToken, setApiToken] = useState('');
    const [status, setStatus] = useState('');

    const [expansions, setExpansions] = useState([true, false, false]);

    const handleExpansion = sel => (event) => {
        let temp = [...expansions]
        temp[sel] = !temp[sel]
        setExpansions(temp);
    };

    useEffect(() => {
        chrome.storage.local.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            console.log('Getting everything in storage', items)
            setApiToken(items.apiToken)
        });
    }, [])

    const saveForm = (event) => {
        event.preventDefault();
        chrome.storage.local.set({
            apiToken: apiToken,
        }, () => { changeStatus('ok') });
    }

    const clearStorage = () => {
        chrome.storage.local.clear()
        chrome.storage.sync.clear(() => { changeStatus('clear') })

        setApiToken('')
    }

    const changeStatus = (status) => {
        setStatus(status)
        setTimeout(() => {
            setStatus('');
        }, 1 * 1000);
    }


    const onInput = (event) => setApiToken(event.target.value)

    return <ThemeProvider theme={darkTheme}>
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ height: '80vh' }}
        >
            <Card elevation={10} style={{ width: '30%' }}>
                <form onSubmit={saveForm} >
                    <CardContent>
                        <Accordion expanded={expansions[0]} onChange={handleExpansion(0)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Main</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField fullWidth value={apiToken} onInput={onInput} label="API Token" variant="standard" color='primary' />
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch defaultChecked />} label="Show Weekly Goals" />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch defaultChecked />} label="Show Weekly List" />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch defaultChecked />} label="Show My Favorites" />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Show Timeline" />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Show Calendar" />
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expansions[1]} onChange={handleExpansion(1)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Weekly Goals</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Rolling Start" />
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel >Week starts on</InputLabel>
                                    <Select disabled value='monday'>
                                        <MenuItem value={'monday'}>Monday</MenuItem>
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                                onChange={handleExpansion(2)}
                            >
                                <Typography>Incidents</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label='Show "How long since last X" ' />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Keep record" />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Count incedents in Week" />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Show average by day" />
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                                onChange={handleExpansion(2)}
                            >
                                <Typography>Miscellaneous</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Show Bookmarks" />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Show GitHub link" />
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel disabled control={<Switch />} label="Enable Sounds" />
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    </CardContent>
                    <CardActions>
                        <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
                            <Button type="submit" color={status === 'ok' ? 'success' : 'primary'}>Save Changes</Button>
                            <Button color='secondary' onClick={() => { chrome.tabs.update({ url: "edge://newtab" }) }} >Go Home</Button>
                            <Button color={status === 'clear' ? 'success' : 'error'} onClick={() => { clearStorage() }} >Reset All</Button>
                        </ButtonGroup>
                    </CardActions>
                </form>
            </Card>
        </Grid>
    </ThemeProvider>
}