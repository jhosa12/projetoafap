

const pageStyle =  `
@page {
    margin: 1rem;
}
@media print {
    body {
        -webkit-print-color-adjust: exact;
    }
    @page {
        size: auto;
        margin: 1rem;
    }
    @page {
        @top-center {
            content: none;
        }
        @bottom-center {
            content: none;
        }
    }
}
`
export default pageStyle