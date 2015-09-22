using BCMY.WebAPI.Models.UnityDI;
using DataAccess_EF.EntityFramework;
using GenericRepository_UnitOfWork.GR;
using GenericRepository_UnitOfWork.UOW;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BCMY.WebAPI.Controllers
{
    [EnableCorsAttribute("http://localhost:52448", "*", "*")]
    public class ExchangeRateController : ApiController
    {
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblExchangeRate> exchangeRateRepository = null;

        // constructor
        public ExchangeRateController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWork = unitOfWork == null ? objectProvider.UnitOfWork : unitOfWork;
            exchangeRateRepository = exchangeRateRepository == null ? unitOfWork.ExchangeRateRepository : exchangeRateRepository;
        }

        // GET: api/ExchangeRate
        public IEnumerable<TblExchangeRate> Get()
        {
            IEnumerable<TblExchangeRate> ers = null;
            try
            {
                ers = exchangeRateRepository.GetAll();
            }
            catch (Exception)
            {
                ers = null;
            }
            return ers;           
        }

        // GET: api/ExchangeRate/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/ExchangeRate
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/ExchangeRate/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/ExchangeRate/5
        public void Delete(int id)
        {
        }
    }
}
