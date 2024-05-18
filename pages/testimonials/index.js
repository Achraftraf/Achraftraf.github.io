  import React from 'react';

  // Testimonials component
  const Testimonials = () => {
    // Specify the path to the CV PDF file in the public folder
    const CVPath = '/cv-ZAROUK-Achraf.pdf';

    return (
      <div>
    

        {/* CV Section */}
        <div>
          {/* Display CV using an iframe */}
          <iframe src={CVPath} style={{ width: '100%', height: '600px', backgroundColor: 'transparent', border: 'none' }} frameBorder="0"></iframe>
          {/* Optional: Provide a download link for the CV PDF file */}
          <a href={CVPath} download>Download CV</a>
        </div>
      </div>
    );
  };

  export default Testimonials;
