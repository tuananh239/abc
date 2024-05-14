import React from 'react';
import { createUseStyles } from 'react-jss';
import building from '../../assets/WIP.png'

const useStyles = createUseStyles({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        height: '100%',
        width: '100%',
    },
    buildImg: {
        width: '600px',
        height: 'auto',
        borderRadius: '10px',
        maskImage: 'linear-gradient(to bottom, transparent, black 20%, transparent)',
    },
    '@media (max-width: 768px)': {
        wrapper: {
            textAlign: 'center',
        },
        buildImg: {
            width: '300px',
        },
    },
});


const Content = () => {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <h1>Strona w trakcie budowy</h1>
            <img className={classes.buildImg} src={building} alt="" />
        </div>
    );
};

export default Content;