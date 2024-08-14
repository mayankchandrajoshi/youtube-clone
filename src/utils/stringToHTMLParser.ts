import parser from 'html-react-parser'

export default (description:string|undefined)=>{

    if(!description)return "";

    // Replace URLs with clickable hyperlinks
    description = description.replace(
        /(\s|^)((http|https):\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" className="desc_link">$2</a>'
    );

    // Replace hashtags with clickable hyperlinks that search for that hashtag on YouTube
    description = description.replace(
        /(\s|^)#(\w+)/g,
        '$1<a href="/search/$2?uploadDate=year&sort=relevance" target="_blank" rel="noopener noreferrer" className="desc_link">#$2</a>'
    );

    // Format line breaks and paragraphs
    description = description.replace(/(\r\n|\n|\r)/g, '<br>');

    return parser(description);
}