// ProjectCard.jsx

import PropTypes from "prop-types";


const ProjectCard = ({
  project = {},
  onEdit,
  onDelete,
}) => {


  return (

    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">


      <div className="flex justify-between items-start mb-3">


        <div>

          <h3 className="text-lg font-bold text-gray-800">

            {project?.title || "Untitled Project"}

          </h3>


          <p className="text-sm text-gray-500 mt-1">

            {project?.description || "No description available"}

          </p>


        </div>


      </div>



      <div className="flex flex-wrap gap-2 mb-4">


        {project?.technologies?.length > 0 ? (

          project.technologies.map((tech) => (

            <span

              key={tech}

              className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-600"

            >

              {tech}

            </span>

          ))

        ) : (

          <span className="text-xs text-gray-400">

            No technologies added

          </span>

        )}


      </div>




      <div className="flex gap-3">


        <button

          onClick={() => onEdit?.(project)}

          className="px-4 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"

        >

          Edit

        </button>



        <button

          onClick={() => onDelete?.(project)}

          className="px-4 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100"

        >

          Delete

        </button>


      </div>


    </div>

  );

};



ProjectCard.propTypes = {

  project: PropTypes.shape({

    id: PropTypes.oneOfType([

      PropTypes.string,

      PropTypes.number,

    ]),

    title: PropTypes.string,

    description: PropTypes.string,

    technologies: PropTypes.arrayOf(

      PropTypes.string

    ),

  }),


  onEdit: PropTypes.func,

  onDelete: PropTypes.func,

};


export default ProjectCard;