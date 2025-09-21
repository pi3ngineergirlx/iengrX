const Card = (props) => {
    return (
        <td className={'card' + props.color}>
            <h3>{props.title}</h3>
        </td>
    )
}

export default Card;