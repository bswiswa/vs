const COLORS = [
    '#a3a9af',
    '#99c2ef',
    '#76f593',
    '#f98792',
    '#ffecb2',
]
const colorPicker = (len) => {
    return COLORS[len % COLORS.length];
}

export default colorPicker;