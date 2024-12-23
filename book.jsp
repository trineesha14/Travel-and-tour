<%@page import="java.sql.*"%>
<%
    String mail=request.getParameter("name");
    String pswd=request.getParameter("arrival");
    String m=request.getParameter("leaving");
    String p=request.getParameter("places");
    
    try
    {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            Connection con=DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe","system","system");
            PreparedStatement pst=con.prepareStatement("insert into book values(?,?,?,?)");
            pst.setString(1,mail);
            pst.setString(2,pswd);
            pst.setString(3,m);
            pst.setString(4,p);
            
            pst.executeUpdate();
            if(pst!=null)
            {
                out.print("<h1> one record inserted sucessfully</h1>");
                response.sendRedirect("1srpade.html");
                //out.print("<h1> one record inserted sucessfully</h1>");
            }
            con.close();
        }
        catch(Exception e)
        {
%>
    <%=e%>
<%      }
%>