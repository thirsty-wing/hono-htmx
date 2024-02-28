import { PropsWithChildren } from "hono/jsx";

interface LayoutProps {
  title?: string;
}

const Layout = (props: PropsWithChildren<LayoutProps>) => {
  return (
    <html hx-boost="true">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" href="/static/global.css" />
        <script type="text/javascript" src="/static/htmx.js"></script>
        {props.title && <title>{props.title}</title>}
      </head>
      <body>{props.children}</body>
    </html>
  );
};

export default Layout;
