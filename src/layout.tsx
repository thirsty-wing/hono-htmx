import { PropsWithChildren } from "hono/jsx";

interface LayoutProps {
  title?: string;
}

const Layout = (props: PropsWithChildren<LayoutProps>) => {
  return (
    <html hx-boost="true">
      <head>
        <link rel="stylesheet" href="/static/global.css" />
        {props.title && <title>{props.title}</title>}
      </head>
      <body>{props.children}</body>
    </html>
  );
};

export default Layout;
