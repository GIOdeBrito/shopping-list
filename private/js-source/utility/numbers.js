
function floatParser (value)
{
	return parseFloat(String(value).replace(',', '.'));
}

export {
	floatParser
};
