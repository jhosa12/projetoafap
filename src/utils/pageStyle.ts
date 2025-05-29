


const pageStylePortrait =  `
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
const pageStyleLandscape = `
      @page {
          size: landscape;
          margin: 1rem;
      }
      @media print {
          body {
              -webkit-print-color-adjust: exact;
          }
          @page {
              size: landscape;
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



export  {pageStylePortrait as pageStyle,pageStyleLandscape}