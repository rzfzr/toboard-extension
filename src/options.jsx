import "../global.css";
import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

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

const darkTheme=createTheme({
    palette: {
        mode: 'dark',
    },
});

function OptionsPage() {
    const [tokenValue, setTokenValue]=useState('');
    const [status, setStatus]=useState('');

    const [expansions, setExpansions]=useState([true, false, false]);

    const handleExpansion=sel => (event) => {
        let temp=[...expansions]
        temp[sel]=!temp[sel]
        setExpansions(temp);
    };

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
                                <TextField fullWidth value={tokenValue} onInput={onInput} label="API Token" variant="standard" color='primary' />
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
                            <Button type="submit" color={status==='ok'? 'success':'primary'}>Submit</Button>
                            <Button color="error" disabled>Reset All</Button>
                        </ButtonGroup>
                    </CardActions>
                </form>
            </Card>
        </Grid>
    </ThemeProvider>
}

render(<OptionsPage />,
    document.getElementById('app')
);