import CompanyStatusBadge from "./CompanyStatusBadge";

export default function CompanyHeader({ company }) {
  return (
    <div className="border rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <img
          src={company.logo}
          alt={company.name}
          className="w-20 h-20 rounded-lg object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold">
              {company.name}
            </h1>
            <CompanyStatusBadge status={company.status} />
          </div>

          <div className="space-y-2">
            <p>
              <strong>Industry:</strong>{" "}
              {company.industry}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {company.location}
            </p>

            <p>
              <strong>Website:</strong>{" "}
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {company.website}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}