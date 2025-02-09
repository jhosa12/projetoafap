import  DOMPurify  from 'dompurify';





export const SanitizeHtml = (html: string|null) => {
    if(typeof window !== 'undefined' && html){
        return DOMPurify.sanitize(html);
    }
    return ""
}