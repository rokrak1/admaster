interface IconProps {
  size?: number;
  color?: string;
}

export const TextIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 32 32"
  >
    <path
      className="duration-300"
      fill={color}
      d="M6 5.25C6 4.56 6.56 4 7.25 4h17.5c.69 0 1.25.56 1.25 1.25v3.5a1.25 1.25 0 1 1-2.5 0V6.5h-6.25v19h1.5a1.25 1.25 0 1 1 0 2.5h-5.5a1.25 1.25 0 1 1 0-2.5h1.5v-19H8.5v2.25a1.25 1.25 0 1 1-2.5 0z"
    />
  </svg>
);

export const ShapesIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 48 48"
  >
    <path
      className="duration-300"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M20 29H6v14h14zm4-25 10 17H14zm12 40a8 8 0 1 0 0-16 8 8 0 0 0 0 16"
    />
  </svg>
);
export const VariableIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 20 20"
  >
    <path
      className="duration-300"
      fill={color}
      fillRule="evenodd"
      d="M4.649 3.084A1 1 0 0 1 5.164 4.4 13.95 13.95 0 0 0 4 10c0 1.993.416 3.886 1.164 5.6a1 1 0 0 1-1.832.8A15.95 15.95 0 0 1 2 10c0-2.274.475-4.44 1.332-6.4a1 1 0 0 1 1.317-.516M12.96 7a3 3 0 0 0-2.342 1.126l-.328.41-.111-.279A2 2 0 0 0 8.323 7H8a1 1 0 0 0 0 2h.323l.532 1.33-1.035 1.295a1 1 0 0 1-.781.375H7a1 1 0 1 0 0 2h.039a3 3 0 0 0 2.342-1.126l.328-.41.111.279A2 2 0 0 0 11.677 14H12a1 1 0 1 0 0-2h-.323l-.532-1.33 1.035-1.295A1 1 0 0 1 12.961 9H13a1 1 0 1 0 0-2zm1.874-2.6a1 1 0 0 1 1.833-.8A15.95 15.95 0 0 1 18 10c0 2.274-.475 4.44-1.332 6.4a1 1 0 1 1-1.832-.8A13.949 13.949 0 0 0 16 10c0-1.993-.416-3.886-1.165-5.6"
      clipRule="evenodd"
    />
  </svg>
);
export const IconsIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 32 32"
  >
    <path
      fill={color}
      className="duration-300"
      d="M5 5v22h22V5zm2 2h8v8H7zm10 0h8v8h-8zm-6 2-3 4h6zm8 0v4h4V9zM7 17h8v8H7zm10 0h8v8h-8zm4 1-2 3 2 3 2-3zm-10 1a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4"
    />
  </svg>
);
export const OpacityIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
  >
    <path
      fill={color}
      d="M19 13v-2h2v2zm2-4V7h-2v2zm0-6h-2v2h2zm-4 12h2v-2h-2zm4 2v-2h-2v2zm-8 0v-2h2v-2h-2v-2h2V9h-2V7h2V5h-2V3H3v18h10v-2h2v-2zm2 4h2v-2h-2zm2-18h-2v2h2zm0 8h2V9h-2zm-2 6h2v-2h-2zm2 2h2v-2h-2zm4 2v-2h-2v2zM15 9h2V7h-2zm0 4h2v-2h-2zm2-8v2h2V5z"
    />
  </svg>
);
export const DeleteIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 1024 1024"
  >
    <path
      fill={color}
      d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32zm448-64v-64H416v64zM224 896h576V256H224zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32m192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32"
    />
  </svg>
);
export const PreviewIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 48 48"
  >
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M6 16c.635 1.22 1.596 2.35 2.823 3.355C12.26 22.173 17.779 24 24 24s11.739-1.827 15.177-4.645C40.404 18.35 41.365 17.22 42 16m-13.022 8 2.07 7.727m6.306-10.373 5.656 5.656M5 27.01l5.657-5.657m6.271 10.375L18.998 24"
    />
  </svg>
);
export const SaveIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
  >
    <path
      fill={color}
      d="M3 5.75A2.75 2.75 0 0 1 5.75 3h9.965a3.25 3.25 0 0 1 2.298.952l2.035 2.035c.61.61.952 1.437.952 2.299v9.964A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25zM5.75 4.5c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25H6v-5.25A2.25 2.25 0 0 1 8.25 12h7.5A2.25 2.25 0 0 1 18 14.25v5.25h.25c.69 0 1.25-.56 1.25-1.25V8.286c0-.465-.184-.91-.513-1.238l-2.035-2.035a1.75 1.75 0 0 0-.952-.49V7.25a2.25 2.25 0 0 1-2.25 2.25h-4.5A2.25 2.25 0 0 1 7 7.25V4.5zm10.75 15v-5.25a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v5.25zm-8-15v2.75c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75V4.5z"
    />
  </svg>
);
export const AlignIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
  >
    <path
      fill={color}
      fillRule="evenodd"
      d="M3.375 1.625a.75.75 0 0 1 .75.75v20a.75.75 0 0 1-1.5 0v-20a.75.75 0 0 1 .75-.75"
      clipRule="evenodd"
    />
    <path
      fill={color}
      d="M7.375 7.875c0-.935 0-1.402.201-1.75a1.5 1.5 0 0 1 .549-.549c.348-.201.815-.201 1.75-.201h9c.935 0 1.402 0 1.75.201a1.5 1.5 0 0 1 .549.549c.201.348.201.815.201 1.75s0 1.402-.201 1.75a1.5 1.5 0 0 1-.549.549c-.348.201-.815.201-1.75.201h-9c-.935 0-1.402 0-1.75-.201a1.5 1.5 0 0 1-.549-.549c-.201-.348-.201-.815-.201-1.75m0 9c0-.935 0-1.402.201-1.75a1.5 1.5 0 0 1 .549-.549c.348-.201.815-.201 1.75-.201h6c.935 0 1.402 0 1.75.201a1.5 1.5 0 0 1 .549.549c.201.348.201.815.201 1.75s0 1.402-.201 1.75a1.5 1.5 0 0 1-.549.549c-.348.201-.815.201-1.75.201h-6c-.935 0-1.402 0-1.75-.201a1.5 1.5 0 0 1-.549-.549c-.201-.348-.201-.815-.201-1.75"
    />
  </svg>
);
export const ColorIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
  >
    <path
      fill={color}
      d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22m0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7"
    />
    <circle cx={6.5} cy={11.5} r={1.5} fill={color} />
    <circle cx={9.5} cy={7.5} r={1.5} fill={color} />
    <circle cx={14.5} cy={7.5} r={1.5} fill={color} />
    <circle cx={17.5} cy={11.5} r={1.5} fill={color} />
  </svg>
);
export const LayerDown: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 100 100"
  >
    <path
      fill={color}
      d="m89.91 78.264-9.178.007 8.211 9.67-77.875.053 8.22-9.682-9.188.008L.832 89.234A3.5 3.5 0 0 0 3.502 95l93-.064a3.5 3.5 0 0 0 2.666-5.766zM41.34 5v20.705H24.637L50 51.174l25.363-25.469H58.66V5zm30.912 32.324c-2.317 2.328-4.632 4.658-6.951 6.985h5l18.64 21.957-77.873.052 18.686-22.01H34.7c-2.317-2.328-4.637-4.65-6.955-6.978a3.5 3.5 0 0 0-2.28 1.213L.833 67.559a3.5 3.5 0 0 0 2.67 5.765l93-.064a3.5 3.5 0 0 0 2.666-5.766L74.59 38.543a3.5 3.5 0 0 0-2.338-1.219"
      color={color}
    />
  </svg>
);
export const LayerUp: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 100 100"
  >
    <path
      fill={color}
      d="M50 5 24.637 30.469H41.34v20.705h17.32V30.469h16.703ZM28.135 37.309a3.5 3.5 0 0 0-2.668 1.234L.832 67.559a3.5 3.5 0 0 0 2.67 5.765l93-.064a3.5 3.5 0 0 0 2.666-5.766L74.59 38.543a3.5 3.5 0 0 0-2.668-1.234H64.66c-.002 2.333-.008 4.666-.008 7h5.649l18.64 21.957-77.873.052 18.686-22.01h5.586c.002-2.333.003-4.666 0-7zM89.91 78.264l-9.178.007 8.211 9.67-77.875.053 8.22-9.682-9.188.008L.832 89.234A3.5 3.5 0 0 0 3.502 95l93-.064a3.5 3.5 0 0 0 2.666-5.766z"
      color={color}
    />
  </svg>
);
export const DuplicateIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 512 512"
  >
    <rect
      width={336}
      height={336}
      x={128}
      y={128}
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={32}
      rx={57}
      ry={57}
    />
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="m383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24m168-168v160m80-80H216"
    />
  </svg>
);
export const ImageIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 512 512"
  >
    <rect
      width={416}
      height={352}
      x={48}
      y={80}
      fill="none"
      className="duration-300"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={32}
      rx={48}
      ry={48}
    />
    <circle
      cx={336}
      className="duration-300"
      cy={176}
      r={32}
      fill="none"
      stroke={color}
      strokeMiterlimit={10}
      strokeWidth={32}
    />
    <path
      className="duration-300"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="m304 335.79-90.66-90.49a32 32 0 0 0-43.87-1.3L48 352m176 80 123.34-123.34a32 32 0 0 1 43.11-2L464 368"
    />
  </svg>
);
