using BCMY.WebAPI.Models.UnityDI;
using DataAccess_EF.EntityFramework;
using GenericRepository_UnitOfWork.GR;
using GenericRepository_UnitOfWork.UOW;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BCMY.WebAPI.Controllers
{
    [EnableCorsAttribute("http://localhost:52448", "*", "*")]
    public class PastSalesOrderController : ApiController
    {
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblOrder> orderRepository = null;

        // constructor
        public PastSalesOrderController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWork = unitOfWork == null ? objectProvider.UnitOfWork : unitOfWork;
            orderRepository = orderRepository == null ? unitOfWork.OrderRepository : orderRepository;
        }

        // http://localhost:61945/api/PastSalesOrder?companyid=1&contactfulname=kumar_sangakkara&vat=YES&currency=1&orderDate=
        [HttpGet, ActionName("CreateOrder")]
        public string CreatePastSalesOrder(int companyId, string contactFulName, string vat, int currency, DateTime orderDate)
        {
            try
            {
                // call stored procedure via repository
                var result = orderRepository.SQLQuery<string>("SP_CreatePastSalesOrder @companyId, @contactFulName, @vat, @currencyId, @type, @orderDate",
                    new SqlParameter("companyId", SqlDbType.Int) { Value = companyId },
                    new SqlParameter("contactFulName", SqlDbType.Text) { Value = contactFulName },
                    new SqlParameter("vat", SqlDbType.VarChar) { Value = vat },
                    new SqlParameter("currencyId", SqlDbType.Int) { Value = currency },
                    new SqlParameter("type", SqlDbType.Text) { Value = "sales" },
                    new SqlParameter("orderDate", SqlDbType.DateTime) { Value = orderDate });

                // get order Id 
                try
                {
                    int orderId = int.Parse(result.FirstOrDefault<string>());
                    return orderId.ToString();
                }
                catch (FormatException) 
                {
                    //string msgFrmDb = result.FirstOrDefault<string>();
                    //return msgFrmDb;
                    return "Error - Please insert exchange rates for - " + orderDate.ToShortDateString() + " - before inserting any past orders";
                }                
            }
            catch (Exception)
            {
                return "Error - exception - Please contact IT support";
            }
        }

    }
}
