using BCMY.WebAPI.Models.UnityDI;
using BCMY.WebAPI.Util;
using DataAccess_EF.EntityFramework;
using DataAccess_EF.ViewModels;
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
        GenericRepository<TblOrderLine> orderLineRepository = null;

        // constructor
        public PastSalesOrderController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWork = unitOfWork == null ? objectProvider.UnitOfWork : unitOfWork;
            orderRepository = orderRepository == null ? unitOfWork.OrderRepository : orderRepository;
            orderLineRepository = orderLineRepository == null ? unitOfWork.OrderLineRepository : orderLineRepository;
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


        /// <summary>
        /// Used to save a past negotiation/orderline
        /// </summary>
        /// http://localhost:61945/api/PastSalesOrder?productListId=107233&quantityVal=3&pricePerItem=5.0&totalAmountVal=15.0&statusVal=2&orderIdVal=47&=orderDate
        [HttpGet, ActionName("SavePastOrderlineWithNegotiation")]
        public IList<OrderLineViewModel> SavePastOrderlineWithNegotiation(int productListId, decimal quantityVal, decimal pricePerItem, decimal totalAmountVal, int statusVal, int orderIdVal, DateTime orderDate)
        {
            try
            {
                // validation 
                if (OrderLineNegotiationValidator.ValidateOrderLineOrNegotiation(productListId, quantityVal, pricePerItem, totalAmountVal, statusVal, orderIdVal))
                {
                    string status = CommonBehaviour.GetCommonStatusString(statusVal);
                    // call stored procedure via repository
                    var result = orderLineRepository.SQLQuery<OrderLineViewModel>("SP_SavePastOrderLineWithNegotiation @productListId, @quantityVal, @pricePerItem, @totalAmountVal, @status, @orderIdVal, @orderDate",
                        new SqlParameter("productListId", SqlDbType.Int) { Value = productListId },
                        new SqlParameter("quantityVal", SqlDbType.Int) { Value = quantityVal },
                        new SqlParameter("pricePerItem", SqlDbType.Decimal) { Value = pricePerItem },
                        new SqlParameter("totalAmountVal", SqlDbType.Decimal) { Value = totalAmountVal },
                        new SqlParameter("status", SqlDbType.Text) { Value = status },                       
                        new SqlParameter("orderIdVal", SqlDbType.Int) { Value = orderIdVal },
                        new SqlParameter("orderDate", SqlDbType.DateTime) { Value = orderDate });

                    // convert the result orderlines (by order ID)
                    IList<OrderLineViewModel> orderLinesOfOrder = result.ToList<OrderLineViewModel>();
                    orderLinesOfOrder = CommonBehaviour.FixDateTime(orderLinesOfOrder);
                    return orderLinesOfOrder;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}
