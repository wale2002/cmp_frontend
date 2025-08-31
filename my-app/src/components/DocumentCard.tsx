// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import { Download, Eye, Edit, Trash2, Calendar, User } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";

// interface Document {
//   _id: string;
//   name: string;
//   documentType: "SLA" | "NDA" | "Contract" | "Other";
//   uploadDate: string;
//   uploadedBy?: string;
//   accessCount?: number;
// }

// interface DocumentCardProps {
//   document: Document;
//   canEdit?: boolean;
//   onView?: (doc: Document) => void;
//   onDownload?: (doc: Document) => void;
//   onEdit?: (doc: Document) => void;
//   onDelete?: (doc: Document) => void;
// }

// const getDocumentTypeColor = (type: string) => {
//   switch (type) {
//     case "SLA":
//       return "bg-success-light text-success border-success/20";
//     case "NDA":
//       return "bg-warning-light text-warning border-warning/20";
//     case "Contract":
//       return "bg-primary-light text-primary border-primary/20";
//     default:
//       return "bg-secondary text-secondary-foreground border-border";
//   }
// };

// const DocumentCard = ({
//   document,
//   canEdit = false,
//   onView,
//   onDownload,
//   onEdit,
//   onDelete,
// }: DocumentCardProps) => {
//   return (
//     <Card className="hover:shadow-medium transition-all duration-200 hover:-translate-y-1">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div className="space-y-2 flex-1">
//             <CardTitle className="text-lg leading-6">{document.name}</CardTitle>
//             <Badge
//               variant="outline"
//               className={getDocumentTypeColor(document.documentType)}
//             >
//               {document.documentType}
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//           <div className="flex items-center gap-1">
//             <Calendar className="h-4 w-4" />
//             <span>
//               {formatDistanceToNow(new Date(document.uploadDate))} ago
//             </span>
//           </div>

//           {document.accessCount !== undefined && (
//             <div className="flex items-center gap-1">
//               <Eye className="h-4 w-4" />
//               <span>{document.accessCount} views</span>
//             </div>
//           )}
//         </div>

//         {document.uploadedBy && (
//           <div className="flex items-center gap-1 text-sm text-muted-foreground">
//             <User className="h-4 w-4" />
//             <span>Uploaded by {document.uploadedBy}</span>
//           </div>
//         )}

//         <div className="flex gap-2 pt-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => onView?.(document)}
//           >
//             <Eye className="h-4 w-4 mr-1" />
//             View
//           </Button>

//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => onDownload?.(document)}
//           >
//             <Download className="h-4 w-4 mr-1" />
//             Download
//           </Button>

//           {canEdit && (
//             <>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => onEdit?.(document)}
//               >
//                 <Edit className="h-4 w-4 mr-1" />
//                 Edit
//               </Button>

//               <Button
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => onDelete?.(document)}
//               >
//                 <Trash2 className="h-4 w-4 mr-1" />
//                 Delete
//               </Button>
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default DocumentCard;

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Download, Eye, Edit, Trash2, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Document } from "../types";

interface DocumentCardProps {
  document: Document;
  canEdit?: boolean;
  onView?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  onEdit?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
}

const getDocumentTypeColor = (type: Document["documentType"]) => {
  switch (type) {
    case "SLA":
      return "bg-success-light text-success border-success/20";
    case "NDA":
      return "bg-warning-light text-warning border-warning/20";
    case "Contract":
      return "bg-primary-light text-primary border-primary/20";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
};

const DocumentCard = ({
  document,
  canEdit = false,
  onView,
  onDownload,
  onEdit,
  onDelete,
}: DocumentCardProps) => {
  return (
    <Card className="hover:shadow-medium transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg leading-6">{document.name}</CardTitle>
            <Badge
              variant="outline"
              className={getDocumentTypeColor(document.documentType)}
            >
              {document.documentType}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(document.uploadDate))} ago
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{document.accessCount} views</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Uploaded by {document.uploadedBy}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(document)}
            aria-label={`View ${document.name}`}
          >
            <Eye className="h-3 w-3 mr-1" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDownload?.(document)}
            aria-label={`Download ${document.name}`}
          >
            <Download className="h-3 w-3 mr-1" />
          </Button>

          {canEdit && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(document)}
                aria-label={`Edit ${document.name}`}
              >
                <Edit className="h-3 w-3 mr-1" />
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete?.(document)}
                aria-label={`Delete ${document.name}`}
              >
                <Trash2 className="h-3 w-3 mr-1" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
