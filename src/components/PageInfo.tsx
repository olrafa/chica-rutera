import React, { useState } from 'react';

export const PageInfo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="page-info">
      {open ? (
        <div className="page-info open">
          Hello, my name is Rafael and I am a geographer and developer.
          <br />
          <br /> This page is meant as a study for myself. The code is available
          on{' '}
          <a
            href="https://github.com/rafaelrolivares/chica-rutera"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
          <div className="close-info" onClick={() => setOpen(!open)}>
            Close [&times;]
          </div>
        </div>
      ) : (
        <div className="page-info closed" onClick={() => setOpen(!open)}>
          Chica Rutera{' '}
        </div>
      )}
    </div>
  );
};
