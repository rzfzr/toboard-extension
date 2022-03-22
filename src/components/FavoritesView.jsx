import { render, h } from 'preact';
import ListItem from './ListItem.jsx';
import NewFavorite from './NewFavorite.jsx';

export default function FavoritesView(props) {
    const favorites=props.favorites.length>0? props.entries.reverse():[]

    return <div style={{ maxWidth: '265px', position: 'relative', left: '50%' }}>
        {favorites.map((entry) =>
            <ListItem entry={entry} />
        )}
        <NewFavorite />
    </div>
}
