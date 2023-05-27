import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-10">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p>&copy; 2023 My Website</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline">
              <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
              <li className="list-inline-item"><a href="#">Terms of Use</a></li>
              <li className="list-inline-item"><a href="#">Contact Us</a></li>
              <li className="list-inline-item">
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#newsletterModal"
                >
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="modal fade" id="newsletterModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Subscribe to Our Newsletter</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailFooter"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
